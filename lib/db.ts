import { Pool } from 'pg';

// PostgreSQL connection pool configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Error handling for pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Execute query with automatic schema prefixing
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const schema = process.env.DB_SCHEMA || 'ichigo';
  
  // Replace 'ichigo.' with the configured schema
  const schemaText = text.replace(/ichigo\./g, `${schema}.`);
  
  try {
    const result = await pool.query(schemaText, params);
    return result.rows;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export default pool;

