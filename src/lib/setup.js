import { neon } from '@neondatabase/serverless';

async function setup() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      id SERIAL PRIMARY KEY,
      starting_balance NUMERIC NOT NULL DEFAULT 0,
      weekly_budget NUMERIC NOT NULL DEFAULT 0,
      weekly_savings_goal NUMERIC NOT NULL DEFAULT 0,
      has_completed_onboarding BOOLEAN NOT NULL DEFAULT FALSE,
      total_savings NUMERIC NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      amount NUMERIC NOT NULL,
      type VARCHAR(50) NOT NULL,
      category VARCHAR(255) NOT NULL,
      date TIMESTAMP NOT NULL,
      note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  console.log("Tables created successfully");
}

setup().catch(console.error);
