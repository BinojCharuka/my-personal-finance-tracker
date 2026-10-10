const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  const settings = await sql`SELECT * FROM user_settings`;
  console.log("Settings:", settings);
  
  const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
  console.log("Transactions:");
  transactions.forEach(t => console.log(t));
}

main().catch(console.error);
