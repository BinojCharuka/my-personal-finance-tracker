"use client";

import { formatCurrency, cn } from "@/lib/utils";
import { PiggyBank, Target, TrendingUp, Plus, Minus, Check } from "lucide-react";
import { useState, useTransition } from "react";
import { addTransaction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ClientSavings({ 
  totalSavings, 
  savedThisMonth, 
  savedThisWeek, 
  weeklySavingsGoal 
}: { 
  totalSavings: number, 
  savedThisMonth: number, 
  savedThisWeek: number, 
  weeklySavingsGoal: number 
}) {
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"deposit" | "withdraw">("deposit");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const weeklyGoalPercentage = Math.min(100, Math.max(0, (savedThisWeek / weeklySavingsGoal) * 100));

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    startTransition(async () => {
      const d = new Date();
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      await addTransaction({
        amount: Number(amount),
        type: action === "deposit" ? "savings_deposit" : "savings_withdrawal",
        category: action === "deposit" ? "Deposit" : "Withdrawal",
        date: localDateStr,
        note: "Manual Savings Transfer",
      });

      setAmount("");
      router.refresh();
    });
  };

  return (
    <>
      <div className="bg-primary rounded-3xl p-6 shadow-2xl shadow-primary/10 shadow-primary/20 text-white flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
        <PiggyBank className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 text-white" />
        <p className="text-sm font-medium text-primary-foreground/80 mt-2">Total Savings</p>
        <h2 className="text-4xl font-bold tracking-tight">
          {formatCurrency(totalSavings)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Saved This Month</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(savedThisMonth)}</p>
        </div>
        
        <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Target className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-medium uppercase tracking-wider">Weekly Goal</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(weeklySavingsGoal)}</p>
        </div>
      </div>

      <div className="bg-[#121212] p-6 rounded-2xl shadow-none border border-zinc-800/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-zinc-200">Weekly Goal Progress</span>
          <span className="text-sm font-bold text-white">{formatCurrency(savedThisWeek)} / {formatCurrency(weeklySavingsGoal)}</span>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-4 overflow-hidden relative">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${weeklyGoalPercentage}%` }}
          ></div>
        </div>
        {weeklyGoalPercentage >= 100 && (
          <div className="flex items-center gap-1.5 mt-4 text-green-600 text-sm font-semibold bg-green-50 p-3 rounded-xl">
            <Check className="w-5 h-5" />
            Awesome! You reached your weekly savings goal!
          </div>
        )}
      </div>

      <div className="bg-[#121212] p-6 rounded-2xl shadow-none border border-zinc-800/50">
        <h3 className="font-semibold text-white mb-4">Transfer Money</h3>
        
        <form onSubmit={handleTransaction} className="space-y-4">
          <div className="flex p-1 bg-[#1a1a1a] rounded-xl">
            <button
              type="button"
              onClick={() => setAction("deposit")}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all",
                action === "deposit" ? "bg-[#121212] text-green-600 shadow-none" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Plus className="w-4 h-4" /> Move to Savings
            </button>
            <button
              type="button"
              onClick={() => setAction("withdraw")}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all",
                action === "withdraw" ? "bg-[#121212] text-white shadow-none" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <Minus className="w-4 h-4" /> Withdraw
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rs.</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-4 py-4 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xl font-bold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-semibold shadow-none transition-all flex items-center justify-center gap-2",
              isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-slate-700 active:scale-[0.98]"
            )}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isPending ? "Processing..." : "Confirm Transfer"}
          </button>
        </form>
      </div>
    </>
  );
}
