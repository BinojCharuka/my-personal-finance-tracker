export const instant = false;
import { getSettings, getTransactions } from "@/lib/actions";
import { isSameWeek, isSameMonth } from "@/lib/dateUtils";
import ClientReports from "@/components/ClientReports";



export default async function Reports() {
  const settings = await getSettings();
  if (!settings) return null;

  const transactions = await getTransactions();
  const today = new Date();

  // --- WEEKLY DATA ---
  const weeklyTransactions = transactions.filter(t => isSameWeek(new Date(t.date), today));
  
  let wInc = 0, wExp = 0, wSav = 0;
  const dailyExpenses = { "Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0 };
  const wCategoryExpenses: Record<string, number> = {};

  weeklyTransactions.forEach(t => {
    if (t.type === "income") wInc += t.amount;
    if (t.type === "savings_deposit") wSav += t.amount;
    if (t.type === "savings_withdrawal") wSav -= t.amount;
    
    if (t.type === "expense") {
      wExp += t.amount;
      
      const date = new Date(t.date);
      const dayStr = date.toLocaleDateString("en-US", { weekday: "short" }) as keyof typeof dailyExpenses;
      if (dailyExpenses[dayStr] !== undefined) {
        dailyExpenses[dayStr] += t.amount;
      }

      wCategoryExpenses[t.category] = (wCategoryExpenses[t.category] || 0) + t.amount;
    }
  });

  const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
    name: day,
    amount: dailyExpenses[day as keyof typeof dailyExpenses]
  }));

  const sortedWCategories = Object.entries(wCategoryExpenses).sort((a, b) => b[1] - a[1]);
  const biggestWCategory = sortedWCategories.length > 0 ? sortedWCategories[0][0] : "None";
  
  let highestDay = "None";
  let highestDayAmount = 0;
  chartData.forEach(d => {
    if (d.amount > highestDayAmount) {
      highestDayAmount = d.amount;
      highestDay = d.name;
    }
  });

  const weeklyData = {
    income: wInc,
    expense: wExp,
    saved: wSav,
    chartData,
    sortedCategories: sortedWCategories,
    biggestCategory: biggestWCategory,
    highestDay,
    dailyAverage: wExp / 7
  };

  // --- MONTHLY DATA ---
  const monthlyTransactions = transactions.filter(t => isSameMonth(new Date(t.date), today));
  
  let mInc = 0, mExp = 0, mSav = 0;
  const mCategoryExpenses: Record<string, number> = {};

  monthlyTransactions.forEach(t => {
    if (t.type === "income") mInc += t.amount;
    if (t.type === "savings_deposit") mSav += t.amount;
    if (t.type === "savings_withdrawal") mSav -= t.amount;
    if (t.type === "expense") {
      mExp += t.amount;
      mCategoryExpenses[t.category] = (mCategoryExpenses[t.category] || 0) + t.amount;
    }
  });

  const sortedMCategories = Object.entries(mCategoryExpenses).sort((a, b) => b[1] - a[1]);
  const biggestMCategory = sortedMCategories.length > 0 ? sortedMCategories[0][0] : "None";

  const monthlyData = {
    income: mInc,
    expense: mExp,
    saved: mSav,
    biggestCategory: biggestMCategory,
    weeklyAverage: mExp / 4 
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Reports</h1>
        <p className="text-zinc-400 mt-1">Analyze your spending habits.</p>
      </div>

      <ClientReports 
        weeklyData={weeklyData} 
        monthlyData={monthlyData} 
        weeklyBudget={settings.weeklyBudget} 
      />
    </div>
  );
}
