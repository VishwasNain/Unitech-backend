# Backend Server

This is a Node.js/Express.js backend server that connects to a Neon PostgreSQL database and is designed to be deployed on Render.

## Features

- Express.js server with modern ES modules
- PostgreSQL database connection with Neon
- Environment configuration with dotenv
- Error handling middleware
- Security best practices (CORS, Helmet, rate limiting)
- Logging with Morgan
- RESTful API structure

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL database

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the variables in `.env` with your configuration

4. **Database Setup**
   - Create a new database in Neon
   - Run the following SQL to create the users table:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Development

```bash
# Start development server with hot-reload
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Database Configuration (Neon)
DATABASE_URL=your_neon_database_connection_string

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create a user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Deployment to Render

1. **Create a new Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" and select "Web Service"
   - Connect your GitHub/GitLab repository

2. **Configure the service**
   - **Name**: your-service-name
   - **Region**: Select the closest region
   - **Branch**: main (or your preferred branch)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from your `.env` file
   - **Auto-Deploy**: Enable if you want automatic deployments on push

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your application

## Connecting to Neon

1. Create a new project in [Neon](https://neon.tech/)
2. Get your database connection string from the Neon dashboard
3. Add it to your environment variables as `DATABASE_URL`

## License

MIT
