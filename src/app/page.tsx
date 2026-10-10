export const instant = false;
import { getSettings, getTransactions } from "@/lib/actions";
import Onboarding from "@/components/Onboarding";
import { formatCurrency, cn } from "@/lib/utils";
import { isSameDay, isSameWeek } from "@/lib/dateUtils";
import { ArrowDown, ArrowUp, Wallet, Target, PiggyBank, AlertCircle, Zap, PlusCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import ClientTransactionList from "@/components/ClientTransactionList";



export default async function Home() {
  const settings = await getSettings();

  if (!settings) {
    return <Onboarding />;
  }

  const transactions = await getTransactions();

  const d = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayStr = formatter.format(d);
  
  const todayTransactions = transactions
    .filter(t => t.date === todayStr && (t.type === 'expense' || t.type === 'income'))
    .sort((a, b) => b.timestamp - a.timestamp);
    
  const thisWeekTransactions = transactions.filter(t => isSameWeek(new Date(t.date), new Date(todayStr)));

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalSavingsDeposit = 0;
  let totalSavingsWithdrawal = 0;

  transactions.forEach(t => {
    if (t.type === "income") totalIncome += t.amount;
    if (t.type === "expense") totalExpenses += t.amount;
    if (t.type === "savings_deposit") totalSavingsDeposit += t.amount;
    if (t.type === "savings_withdrawal") totalSavingsWithdrawal += t.amount;
  });

  const availableBalance = settings.startingBalance + totalIncome - totalExpenses - totalSavingsDeposit + totalSavingsWithdrawal;

  let spentThisWeek = 0;
  let savedThisWeek = 0;
  thisWeekTransactions.forEach(t => {
    if (t.type === "expense") spentThisWeek += t.amount;
    if (t.type === "savings_deposit") savedThisWeek += t.amount;
    if (t.type === "savings_withdrawal") savedThisWeek -= t.amount;
  });

  const weeklyBudgetLeft = settings.weeklyBudget - spentThisWeek;
  const budgetUsedPercentage = Math.min(100, Math.max(0, (spentThisWeek / settings.weeklyBudget) * 100));
  
  let todaysSpending = 0;
  todayTransactions.forEach(t => {
    if (t.type === "expense") todaysSpending += t.amount;
  });

  return (
    <div className="relative min-h-screen pb-20 md:pb-0">
      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden">
        {/* Neon Green Top Background */}
        <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-br from-primary via-primary to-[#85a600] z-0 rounded-b-[40px] px-6 pt-10">
          <div className="flex items-center text-black/90">
            <span className="font-bold text-lg tracking-tight">Expense Tracker</span>
          </div>
        </div>

        {/* Main Dark Container */}
        <div className="relative z-10 pt-[25vh] px-4 pb-6 space-y-4">
          {/* Balance Card */}
          <div className="bg-[#1a1a1a] rounded-[32px] p-6 shadow-2xl shadow-black/50 border border-zinc-800/80 flex flex-col items-center relative">
            <div className="w-12 h-1.5 bg-zinc-800 rounded-full mb-6"></div>
            
            <p className="text-sm font-medium text-zinc-400">Total Balance</p>
            <h2 className="text-4xl font-bold text-white tracking-tight mt-2">
              {formatCurrency(availableBalance)}
            </h2>
            <p className="text-primary font-medium text-sm mt-2">+{formatCurrency(totalIncome)} <span className="text-zinc-500 ml-1">in</span></p>

            {/* Circular Action Buttons */}
            <div className="flex items-center justify-around w-full mt-8">
              <Link href="/history" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-zinc-700/50">
                  <ArrowUp className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-400">History</span>
              </Link>
              <Link href="/savings" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-zinc-700/50">
                  <ArrowDown className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-400">Savings</span>
              </Link>
              <Link href="/presets" className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-full bg-[#2a2a2a] flex items-center justify-center border border-zinc-700/50">
                  <Zap className="w-6 h-6 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-400">Presets</span>
              </Link>
            </div>
          </div>

          {/* Recent Transfers List */}
          <div className="bg-[#1a1a1a] rounded-3xl p-5 border border-zinc-800/80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Recent Transactions</h3>
              <Link href="/history" className="text-xs text-zinc-500 font-medium hover:text-primary">View All</Link>
            </div>
            <ClientTransactionList transactions={todayTransactions.slice(0, 5)} todaysSpending={todaysSpending} />
          </div>
        </div>
      </div>


      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block p-8 space-y-6">
        <div className="bg-[#121212] rounded-3xl p-6 shadow-none border border-zinc-800/50 flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-primary"></div>
          <p className="text-sm font-medium text-zinc-400 mt-2">Available Balance</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {formatCurrency(availableBalance)}
          </h2>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Quick Menu</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
            <Link href="/presets" className="snap-start shrink-0 w-32 bg-primary/10 hover:bg-primary/20 backdrop-blur-md transition-colors rounded-[32px] p-5 flex flex-col justify-between h-32 border border-primary/20">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-primary text-sm">Presets</span>
            </Link>
            <Link href="/savings" className="snap-start shrink-0 w-32 bg-[#1a1a1a]/80 backdrop-blur-md hover:bg-[#222] transition-colors border border-white/5 rounded-[32px] p-5 flex flex-col justify-between h-32">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-semibold text-zinc-300 text-sm leading-tight">Add<br/>Savings</span>
            </Link>
            <Link href="/reports" className="snap-start shrink-0 w-32 bg-[#1a1a1a]/80 backdrop-blur-md hover:bg-[#222] transition-colors border border-white/5 rounded-[32px] p-5 flex flex-col justify-between h-32">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-sky-400" />
              </div>
              <span className="font-semibold text-zinc-300 text-sm leading-tight">View<br/>Reports</span>
            </Link>
            <Link href="/history" className="snap-start shrink-0 w-32 bg-[#1a1a1a]/80 backdrop-blur-md hover:bg-[#222] transition-colors border border-white/5 rounded-[32px] p-5 flex flex-col justify-between h-32">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-rose-400" />
              </div>
              <span className="font-semibold text-zinc-300 text-sm leading-tight">All<br/>Transactions</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-5 rounded-[32px] shadow-none border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <ArrowDown className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-medium uppercase tracking-wider">Spent Week</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(spentThisWeek)}</p>
          </div>
          
          <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-5 rounded-[32px] shadow-none border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium uppercase tracking-wider">Saved Week</span>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(savedThisWeek)}</p>
          </div>

          <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-5 rounded-[32px] shadow-none border border-white/5">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Target className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-medium uppercase tracking-wider">Budget Left</span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              weeklyBudgetLeft < 0 ? "text-rose-500" : "text-white"
            )}>
              {formatCurrency(weeklyBudgetLeft)}
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a]/80 backdrop-blur-md p-6 rounded-[32px] shadow-none border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-zinc-300">Weekly Budget Used</span>
            <span className="text-sm font-bold text-white">{budgetUsedPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden border border-white/5">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                budgetUsedPercentage > 90 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : budgetUsedPercentage > 75 ? "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]" : "bg-primary shadow-[0_0_15px_rgba(204,255,0,0.5)]"
              )}
              style={{ width: `${budgetUsedPercentage}%` }}
            ></div>
          </div>
          {budgetUsedPercentage > 85 && (
            <div className="flex items-center gap-1.5 mt-4 text-rose-500 text-xs font-medium bg-rose-500/10 p-3 rounded-full border border-rose-500/20">
              <AlertCircle className="w-4 h-4" />
              You are getting close to your weekly budget limit!
            </div>
          )}
        </div>

        <ClientTransactionList transactions={todayTransactions} todaysSpending={todaysSpending} />
      </div>
    </div>
  );
}
