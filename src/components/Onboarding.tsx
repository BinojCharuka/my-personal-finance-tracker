"use client";

import { useState } from "react";
import { Wallet, Target, PiggyBank } from "lucide-react";
import { completeOnboarding } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const [startingBalance, setStartingBalance] = useState("");
  const [weeklyBudget, setWeeklyBudget] = useState("");
  const [weeklySavingsGoal, setWeeklySavingsGoal] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startingBalance || !weeklyBudget || !weeklySavingsGoal) return;

    await completeOnboarding({
      startingBalance: Number(startingBalance),
      weeklyBudget: Number(weeklyBudget),
      weeklySavingsGoal: Number(weeklySavingsGoal),
    });
    
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="bg-[#121212] rounded-3xl w-full max-w-md p-8 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Wallet className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to My Expense Tracker</h1>
        <p className="text-zinc-400 mb-8">Let's set up your finances in just 3 quick steps.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-zinc-500" /> Current Balance (LKR)
            </label>
            <input
              type="number"
              value={startingBalance}
              onChange={e => setStartingBalance(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-500" /> Weekly Budget (LKR)
            </label>
            <input
              type="number"
              value={weeklyBudget}
              onChange={e => setWeeklyBudget(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-zinc-500" /> Weekly Savings Goal (LKR)
            </label>
            <input
              type="number"
              value={weeklySavingsGoal}
              onChange={e => setWeeklySavingsGoal(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full px-4 py-3.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-black font-bold tracking-wide rounded-xl font-semibold shadow-2xl shadow-primary/10 shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] mt-4"
          >
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
}
