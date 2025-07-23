import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../../migrations/001_initial_schema.sql');
    const migrationSQL = await readFile(migrationPath, 'utf8');
    
    // Split the SQL file into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        console.log(`🔧 Executing: ${statement.substring(0, 50)}...`);
        await query(statement);
      } catch (error) {
        // Skip duplicate table errors
        if (!error.message.includes('already exists')) {
          throw error;
        }
        console.log('ℹ️  Table already exists, skipping...');
      }
    }
    
    console.log('✅ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
