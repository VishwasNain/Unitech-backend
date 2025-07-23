import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

// Define configuration object
const config = {
  // Server configuration
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  
  // Database configuration
  db: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : { rejectUnauthorized: false },
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per windowMs
  },
  
  // Logging
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    dir: path.join(__dirname, '../../logs'),
  },
};

// Validate required configurations
const requiredConfigs = [
  { key: 'DATABASE_URL', value: config.db.url },
  { key: 'JWT_SECRET', value: config.jwt.secret },
  { key: 'CLIENT_URL', value: config.cors.origin },
];

if (process.env.NODE_ENV === 'production') {
  const missingConfigs = requiredConfigs
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  if (missingConfigs.length > 0) {
    throw new Error(`Missing required environment variables: ${missingConfigs.join(', ')}`);
  }
}

export default config;
