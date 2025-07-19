# Unitech E-Commerce API

This is the backend API for the Unitech E-Commerce platform, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Order processing
- Newsletter subscription
- File uploads
- Pagination, filtering, and sorting
- Error handling
- Security best practices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

4. Start the development server
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Database Setup

1. Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env`

2. Seed the database with sample data (optional)
   ```bash
   # Import sample data
   node seeder -i
   
   # Delete all data
   node seeder -d
   ```

## API Documentation

API documentation is available at `/api-docs` when running in development mode.

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm test` - Run tests
- `node seeder -i` - Import sample data
- `node seeder -d` - Delete all data

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_EXPIRE` - JWT token expiration time
- `JWT_COOKIE_EXPIRE` - JWT cookie expiration time
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_EMAIL` - SMTP email address
- `SMTP_PASSWORD` - SMTP password
- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender name
- `MAX_FILE_UPLOAD` - Maximum file upload size in bytes
- `FILE_UPLOAD_PATH` - Path to store uploaded files

## Project Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── data/             # Sample data for seeding
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── utils/            # Utility functions
├── .env              # Environment variables
├── .gitignore        # Git ignore file
├── package.json      # Project dependencies
└── server.js         # Application entry point
```

## License

This project is licensed under the MIT License.
