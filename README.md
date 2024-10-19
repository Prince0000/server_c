Here's the README for the backend (server) of the Job Portal application:

```markdown
# Job Portal Backend

This is the backend server for the Job Portal application. It's built using Node.js, Express, and MongoDB.

## Setup

1. Clone the repository and navigate to the server directory.

2. Install dependencies:
```

npm install

```

3. Create a `.env` file in the root directory and add the following environment variables:
```

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

```

4. Start the server:
```

npm start

```

For development with auto-restart:
```

npm run dev

````

## Project Structure

- `server.js`: Main entry point of the application
- `routes/`: Contains all route definitions
- `models/`: Defines MongoDB schemas
- `middleware/`: Custom middleware functions
- `services/`: Contains business logic and external service integrations

## API Routes

### Authentication
- POST /api/register: Register a new user
- POST /api/verify-otp: Verify OTP for registration
- POST /api/login-request: Request OTP for login
- POST /api/login-verify: Verify OTP and login

### Jobs
- POST /api/jobs: Create a new job
- GET /api/jobs: Get all jobs for the authenticated user
- POST /api/jobs/send-email: Send email to a single candidate
- POST /api/jobs/send-all-emails: Send emails to all candidates for a job

## Models

### User
```javascript:server/models/User.js
startLine: 1
endLine: 14
````

### Job

```javascript:server/models/Job.js
startLine: 1
endLine: 19
```

## Middleware

### Authentication Middleware

```javascript:server/middleware/auth.js
startLine: 1
endLine: 30
```

This middleware verifies the JWT token for protected routes.

## Services

### Email Service

The application uses Nodemailer to send emails. The email service is responsible for sending OTPs and candidate emails.

```javascript:server/services/emailService.js
startLine: 1
endLine: 85
```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation and verification
- `EMAIL_USER`: Email address used for sending emails
- `EMAIL_PASS`: Password for the email account
