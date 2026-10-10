"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCurrency, cn } from "@/lib/utils";

export default function ClientReports({ weeklyData, monthlyData, weeklyBudget }: { weeklyData: any, monthlyData: any, weeklyBudget: number }) {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");

  return (
    <>
      <div className="flex p-1 bg-[#1a1a1a] rounded-xl mb-4 w-full md:w-64">
        <button
          onClick={() => setView("weekly")}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
            view === "weekly" ? "bg-[#121212] text-white shadow-none" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          This Week
        </button>
        <button
          onClick={() => setView("monthly")}
          className={cn(
            "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
            view === "monthly" ? "bg-[#121212] text-white shadow-none" : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          This Month
        </button>
      </div>

      {view === "weekly" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#121212] p-4 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Income</p>
              <p className="text-xl font-bold text-emerald-400">+{formatCurrency(weeklyData.income)}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Expenses</p>
              <p className="text-xl font-bold text-rose-500">-{formatCurrency(weeklyData.expense)}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Saved</p>
              <p className="text-xl font-bold text-sky-400">{formatCurrency(weeklyData.saved)}</p>
            </div>
            <div className="bg-[#121212] p-4 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Budget</p>
              <p className="text-xl font-bold text-white">
                {weeklyData.expense <= weeklyBudget ? "Under" : "Over"} Budget
              </p>
            </div>
          </div>

          <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
            <h3 className="font-semibold text-white mb-6">Daily Spending</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `Rs.${val}`} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [formatCurrency(val as number), "Spent"]}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {weeklyData.chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.amount > weeklyBudget / 7 ? '#ef4444' : '#16a34a'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
              <h3 className="font-semibold text-white mb-4">Highlights</h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-zinc-400">Daily Average</span>
                  <span className="font-bold text-white">{formatCurrency(weeklyData.dailyAverage)}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-zinc-400">Highest Spending Day</span>
                  <span className="font-bold text-white">{weeklyData.highestDay}</span>
                </li>
                <li className="flex justify-between items-center py-2">
                  <span className="text-zinc-400">Top Category</span>
                  <span className="font-bold text-white">{weeklyData.biggestCategory}</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
              <h3 className="font-semibold text-white mb-4">Categories</h3>
              {weeklyData.sortedCategories.length === 0 ? (
                <p className="text-zinc-500 text-sm">No expenses this week.</p>
              ) : (
                <div className="space-y-3">
                  {weeklyData.sortedCategories.map(([cat, amt]: [string, number]) => (
                    <div key={cat} className="flex justify-between items-center">
                      <span className="text-zinc-300 font-medium">{cat}</span>
                      <span className="font-bold text-white">{formatCurrency(amt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {view === "monthly" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(monthlyData.income)}</p>
            </div>
            <div className="bg-[#121212] p-5 rounded-2xl shadow-none border border-zinc-800/50">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-500">-{formatCurrency(monthlyData.expense)}</p>
            </div>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl shadow-none border border-zinc-800/50">
            <h3 className="font-semibold text-white mb-4">Monthly Overview</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-zinc-400">Total Saved</span>
                <span className="font-bold text-sky-400 text-lg">{formatCurrency(monthlyData.saved)}</span>
              </li>
              <li className="flex justify-between items-center py-3 border-b border-slate-50">
                <span className="text-zinc-400">Average Weekly Spending</span>
                <span className="font-bold text-white text-lg">{formatCurrency(monthlyData.weeklyAverage)}</span>
              </li>
              <li className="flex justify-between items-center py-3">
                <span className="text-zinc-400">Top Expense Category</span>
                <span className="font-bold text-white text-lg">{monthlyData.biggestCategory}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
