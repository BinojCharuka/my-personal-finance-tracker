export const instant = false;
import { getSettings, getTransactions } from "@/lib/actions";
import { isSameMonth, isSameWeek } from "@/lib/dateUtils";
import ClientSavings from "@/components/ClientSavings";



export default async function Savings() {
  const settings = await getSettings();
  if (!settings) return null;

  const transactions = await getTransactions();
  const today = new Date();
  
  let totalSavings = 0;
  let savedThisMonth = 0;
  let savedThisWeek = 0;

  transactions.forEach(t => {
    if (t.type === "savings_deposit") {
      totalSavings += t.amount;
      if (isSameMonth(new Date(t.date), today)) savedThisMonth += t.amount;
      if (isSameWeek(new Date(t.date), today)) savedThisWeek += t.amount;
    }
    if (t.type === "savings_withdrawal") {
      totalSavings -= t.amount;
      if (isSameMonth(new Date(t.date), today)) savedThisMonth -= t.amount;
      if (isSameWeek(new Date(t.date), today)) savedThisWeek -= t.amount;
    }
  });

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Savings</h1>
        <p className="text-zinc-400 mt-1">Track and manage your savings goals.</p>
      </div>

      <ClientSavings 
        totalSavings={totalSavings}
        savedThisMonth={savedThisMonth}
        savedThisWeek={savedThisWeek}
        weeklySavingsGoal={settings.weeklySavingsGoal}
      />
    </div>
  );
}
