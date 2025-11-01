import { Pool } from 'pg';

// Create connection pools for both databases
const pools: { [key: string]: Pool } = {};

function getPool(database: string): Pool {
  if (!pools[database]) {
    pools[database] = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: database, // Dynamic database name
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    // Error handling for pool
    pools[database].on('error', (err) => {
      console.error(`Unexpected error on idle client for ${database}:`, err);
    });
  }
  
  return pools[database];
}

// Test connection for a specific database
export async function testConnection(database?: string): Promise<boolean> {
  try {
    const dbName = database || process.env.DB_NAME || 'ichigo';
    const pool = getPool(dbName);
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log(`Database ${dbName} connected successfully:`, result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Execute query with automatic schema prefixing and dynamic database
export async function query<T = any>(
  text: string,
  params?: any[],
  database?: string
): Promise<T[]> {
  const dbName = database || process.env.DB_NAME || 'ichigo';
  const schema = 'ichigo'; // Schema is always 'ichigo' for both databases
  
  // Replace 'ichigo.' with the configured schema (ichigo.tablename stays ichigo.tablename)
  const schemaText = text.replace(/ichigo\./g, `${schema}.`);
  
  try {
    const pool = getPool(dbName);
    const result = await pool.query(schemaText, params);
    return result.rows;
  } catch (error) {
    console.error(`Query error on ${dbName}:`, error);
    throw error;
  }
}

export default getPool;

