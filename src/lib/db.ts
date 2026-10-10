import Dexie, { type EntityTable } from 'dexie';

export type TransactionType = 'income' | 'expense' | 'savings_deposit' | 'savings_withdrawal';

export interface Transaction {
  id?: number;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO string YYYY-MM-DD
  note?: string;
  timestamp: number; // for sorting
}

export interface UserSettings {
  id: number; // Always 1
  startingBalance: number;
  weeklyBudget: number;
  weeklySavingsGoal: number;
  hasCompletedOnboarding: boolean;
  totalSavings: number;
}

const db = new Dexie('ExpenseTrackerDB') as Dexie & {
  transactions: EntityTable<
    Transaction,
    'id'
  >;
  settings: EntityTable<
    UserSettings,
    'id'
  >;
};

// Schema declaration
db.version(1).stores({
  transactions: '++id, type, category, date, timestamp', // ++ = auto-increment
  settings: 'id'
});

export { db };
