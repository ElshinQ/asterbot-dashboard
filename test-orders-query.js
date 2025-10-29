const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function test() {
  try {
    // Get table structure
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'ichigo' AND table_name = 'orders'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n=== ORDERS TABLE STRUCTURE ===');
    structure.rows.forEach(row => {
      console.log(`${row.column_name} (${row.data_type}) ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Get sample filled order
    const filled = await pool.query(`
      SELECT * FROM ichigo.orders 
      WHERE status = 'FILLED' 
      LIMIT 1
    `);
    
    console.log('\n=== SAMPLE FILLED ORDER ===');
    console.log(JSON.stringify(filled.rows[0], null, 2));
    
    // Get sample canceled order
    const canceled = await pool.query(`
      SELECT * FROM ichigo.orders 
      WHERE status IN ('CANCELED', 'EXPIRED', 'REJECTED') 
      LIMIT 1
    `);
    
    console.log('\n=== SAMPLE CANCELED ORDER ===');
    console.log(JSON.stringify(canceled.rows[0], null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

test();
