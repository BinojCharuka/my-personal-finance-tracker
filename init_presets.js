const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  await sql`
    CREATE TABLE IF NOT EXISTS transaction_presets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      amount NUMERIC NOT NULL,
      type VARCHAR(50) NOT NULL,
      category VARCHAR(255) NOT NULL,
      note VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  console.log("Presets table created successfully!");
}

main().catch(console.error);
