import pg from 'pg';
import config from './config.js';

const { Pool } = pg;
const { db, env } = config;

if (!db.url) {
  throw new Error('Database configuration is missing. Please check your .env file.');
}

// Parse the database URL to check if it's a Neon connection
const isNeon = db.url.includes('neon.tech');

// Configure SSL based on environment and database type
const sslConfig = env === 'production' || isNeon
  ? { 
      rejectUnauthorized: false, // Required for Neon's free tier
      sslmode: 'require'
    }
  : false; // Disable SSL for local development

// Configure the connection pool with production settings
const pool = new Pool({
  connectionString: db.url,
  ssl: sslConfig,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
  maxUses: 7500, // Maximum number of times a client can be used before being closed
  
  // Connection validation
  min: 2, // Minimum number of clients to keep in the pool
  keepAlive: true,
  keepAliveInitialDelayMillis: 30000,
  
  // Log pool events
  application_name: `${env}-app`,
  
  // Neon-specific optimizations
  ...(isNeon ? {
    // These settings help with Neon's connection pooling
    statement_timeout: 10000, // 10 seconds
    query_timeout: 10000, // 10 seconds
    connectionTimeoutMillis: 5000, // 5 seconds
  } : {})
});

// Log pool events for better debugging
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('🔄 New client connected to the database');
  }
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Connect to the database and verify the connection
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('🚀 Connected to PostgreSQL database');
    
    // Run a simple query to verify the connection
    const { rows } = await client.query('SELECT NOW()');
    console.log('📅 Database time:', rows[0].now);
    
    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;
