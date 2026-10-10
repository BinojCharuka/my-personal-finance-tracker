"use server";

import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function getSettings() {
  const sql = getDb();
  const res = await sql`SELECT * FROM user_settings WHERE id = 1`;
  if (res.length === 0) return null;
  return {
    id: res[0].id,
    startingBalance: Number(res[0].starting_balance),
    weeklyBudget: Number(res[0].weekly_budget),
    weeklySavingsGoal: Number(res[0].weekly_savings_goal),
    hasCompletedOnboarding: res[0].has_completed_onboarding,
    totalSavings: Number(res[0].total_savings)
  };
}

export async function completeOnboarding(data: { startingBalance: number, weeklyBudget: number, weeklySavingsGoal: number }) {
  const sql = getDb();
  await sql`
    INSERT INTO user_settings (id, starting_balance, weekly_budget, weekly_savings_goal, has_completed_onboarding, total_savings)
    VALUES (1, ${data.startingBalance}, ${data.weeklyBudget}, ${data.weeklySavingsGoal}, TRUE, 0)
    ON CONFLICT (id) DO UPDATE SET
      starting_balance = EXCLUDED.starting_balance,
      weekly_budget = EXCLUDED.weekly_budget,
      weekly_savings_goal = EXCLUDED.weekly_savings_goal,
      has_completed_onboarding = TRUE;
  `;
  revalidatePath('/', 'layout');
}

export async function getTransactions() {
  const sql = getDb();
  const res = await sql`SELECT *, date::date::text as date_str FROM transactions ORDER BY created_at DESC`;
  return res.map(t => ({
    id: t.id,
    amount: Number(t.amount),
    type: t.type,
    category: t.category,
    date: t.date_str,
    note: t.note,
    timestamp: new Date(t.created_at).getTime()
  }));
}

export async function addTransaction(data: { amount: number, type: string, category: string, date: string, note?: string }) {
  const sql = getDb();
  await sql`
    INSERT INTO transactions (amount, type, category, date, note)
    VALUES (${data.amount}, ${data.type}, ${data.category}, ${data.date}, ${data.note || ""})
  `;
  revalidatePath('/', 'layout');
}

export async function updateTransaction(id: number, data: { amount: number, type: string, category: string, date: string, note?: string }) {
  const sql = getDb();
  await sql`
    UPDATE transactions
    SET amount = ${data.amount},
        type = ${data.type},
        category = ${data.category},
        date = ${data.date},
        note = ${data.note || ""}
    WHERE id = ${id}
  `;
  revalidatePath('/', 'layout');
}

export async function deleteTransaction(id: number) {
  const sql = getDb();
  await sql`DELETE FROM transactions WHERE id = ${id}`;
  revalidatePath('/', 'layout');
}

export async function deleteAllTransactions() {
  const sql = getDb();
  await sql`DELETE FROM transactions`;
  revalidatePath('/', 'layout');
}

// --- Presets ---
export async function getPresets() {
  const sql = getDb();
  const res = await sql`SELECT * FROM transaction_presets ORDER BY created_at DESC`;
  return res.map(p => ({
    id: p.id,
    name: p.name,
    amount: Number(p.amount),
    type: p.type,
    category: p.category,
    note: p.note
  }));
}

export async function addPreset(data: { name: string, amount: number, type: string, category: string, note?: string }) {
  const sql = getDb();
  await sql`
    INSERT INTO transaction_presets (name, amount, type, category, note)
    VALUES (${data.name}, ${data.amount}, ${data.type}, ${data.category}, ${data.note || ""})
  `;
  revalidatePath('/', 'layout');
}

export async function deletePreset(id: number) {
  const sql = getDb();
  await sql`DELETE FROM transaction_presets WHERE id = ${id}`;
  revalidatePath('/', 'layout');
}

export async function usePreset(id: number) {
  const sql = getDb();
  const presetResult = await sql`SELECT * FROM transaction_presets WHERE id = ${id}`;
  if (presetResult.length === 0) return;
  const p = presetResult[0];

  const d = new Date();
  const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  await sql`
    INSERT INTO transactions (amount, type, category, date, note)
    VALUES (${p.amount}, ${p.type}, ${p.category}, ${localDateStr}, ${p.note || ""})
  `;
  revalidatePath('/', 'layout');
}
