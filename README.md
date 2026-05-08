# Portfolio Backend

A Node.js backend for Mohammed Jawaduddin's photography portfolio website.

## Features

- Contact form handling with email notifications
- Admin panel to view submitted messages
- Rate limiting for security
- Input validation
- CORS enabled for frontend integration

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env` file and update with your actual values:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ADMIN_TOKEN=your-secure-admin-token
     PORT=3001
     ```

3. For Gmail, you'll need to:
   - Enable 2-factor authentication
   - Generate an App Password: https://support.google.com/accounts/answer/185833
   - Use the App Password as EMAIL_PASS

## Running

Start the development server:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

The server will run on http://localhost:3001

When deployed, the same app will serve your portfolio site and the backend APIs from the same domain.

## API Endpoints

### POST /api/contact
Submit a contact form message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Photography Inquiry",
  "message": "Hello, I'd like to discuss a project..."
}
```

### GET /api/messages
Get all submitted messages (requires admin token).

**Headers:**
```
Authorization: Bearer your-admin-token
```

### PATCH /api/messages/:id/read
Mark a message as read (requires admin token).

## Admin Panel

Access the admin panel at: http://localhost:3001/admin.html

Use your ADMIN_TOKEN to log in and view/manage messages.

## Serving Files

The backend serves static files from the `public` folder. If you want the portfolio page to be served by the backend as well, place `index.html` in `public`.

## Deployment

This app can be deployed to any service that supports Node.js such as Render, Railway, or a VPS.

### Example: Render
1. Create a GitHub repository for this project.
2. Push the project to GitHub.
3. Create a new Web Service on Render.
4. Connect it to your GitHub repository.
5. Use `npm install` as the build command and `npm start` as the start command.

### Example: Railway
1. Create a new Railway project.
2. Connect the GitHub repo or deploy directly from local files.
3. Set environment variables from `.env` in the Railway dashboard.
4. Use `npm install` and `npm start`.

### Notes
- Your backend and frontend are served together from the same app.
- `index.html` and `admin.html` are now both served from the `public` folder.
- Make sure you set `EMAIL_USER`, `EMAIL_PASS`, and `ADMIN_TOKEN` in the production environment.

For production deployment:

1. Set up a proper email service (SendGrid, Mailgun, etc.)
2. Use a database instead of in-memory storage
3. Set up proper authentication for admin panel
4. Configure HTTPS
5. Set up monitoring and logging

## Frontend Integration

The frontend (index.html) is configured to send requests to `http://localhost:3001`. Update the fetch URL in the JavaScript if deploying to a different domain.

## Security Notes

- Rate limiting is enabled (5 requests per 15 minutes per IP)
- Input validation prevents malicious data
- Admin token provides basic authentication
- CORS is configured for frontend access

For production, implement proper authentication, use environment-specific configurations, and add comprehensive logging.