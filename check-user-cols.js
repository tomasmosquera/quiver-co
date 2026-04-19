const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:quiver2410@localhost:5432/quiver_co' });
  await client.connect();
  const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`);
  console.log('Columns in users table:', res.rows.map(r => r.column_name));
  await client.end();
}
check().catch(console.error);
