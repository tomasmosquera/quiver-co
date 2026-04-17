const { Client } = require('pg');
async function check() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:quiver2410@localhost:5432/quiver_co' });
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log('Tables in public schema:', res.rows.map(r => r.table_name));
  await client.end();
}
check().catch(console.error);
