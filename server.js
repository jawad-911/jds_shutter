const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public
app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve uploaded gallery images

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/contact', limiter);

// In-memory storage for messages (in production, use a database)
let messages = [];

// Routes
app.get('/api/messages', (req, res) => {
  // Simple auth check (in production, use proper authentication)
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(messages);
});

app.post('/api/contact', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().isLength({ min: 1 }).withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  // Store message only; email sending is disabled for now
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };
  messages.push(newMessage);

  res.json({ success: true, message: 'Message received successfully!' });
});

// Mark message as read
app.patch('/api/messages/:id/read', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const messageId = parseInt(req.params.id);
  const message = messages.find(m => m.id === messageId);
  if (message) {
    message.read = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Message not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});