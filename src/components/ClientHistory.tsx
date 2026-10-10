"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { deleteTransaction, deleteAllTransactions } from "@/lib/actions";
import AddTransactionModal from "./AddTransactionModal";
import { formatCurrency, cn } from "@/lib/utils";
import { isSameDay, isSameWeek, isSameMonth } from "@/lib/dateUtils";

type FilterTime = "all" | "today" | "week" | "month";
type FilterType = "all" | "income" | "expense";

export default function ClientHistory({ transactions }: { transactions: any[] }) {
  const [timeFilter, setTimeFilter] = useState<FilterTime>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      startTransition(async () => {
        await deleteTransaction(id);
      });
    }
  };

  const handleClearAll = () => {
    if (confirm("WARNING: Are you sure you want to delete ALL transactions? This cannot be undone.")) {
      startTransition(async () => {
        await deleteAllTransactions();
      });
    }
  };

  const today = new Date();
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  const filteredTransactions = transactions
    .filter(t => {
      if (timeFilter === "today") return isSameDay(new Date(t.date), today);
      if (timeFilter === "week") return isSameWeek(new Date(t.date), today);
      if (timeFilter === "month") return isSameMonth(new Date(t.date), today);
      return true;
    })
    .filter(t => {
      if (typeFilter === "all") return true;
      return t.type === typeFilter;
    })
    .filter(t => {
      if (categoryFilter === "all") return true;
      return t.category === categoryFilter;
    });

  return (
    <>
      <div className="bg-[#121212] p-4 rounded-2xl shadow-none border border-zinc-800/50 flex flex-col md:flex-row gap-3">
        <select 
          value={timeFilter}
          onChange={e => setTimeFilter(e.target.value as FilterTime)}
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select 
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as FilterType)}
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>

        <select 
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c as string} value={c as string}>{c as string}</option>
          ))}
        </select>
        
        <button 
          onClick={handleClearAll}
          disabled={isPending || transactions.length === 0}
          className="px-4 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Clear All
        </button>
      </div>

      <div className="bg-[#121212] rounded-2xl shadow-none border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/50">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Search className="w-8 h-8 text-slate-300 mb-3" />
            <p className="text-zinc-400 font-medium">No transactions found matching your filters.</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  t.type === "expense" ? "bg-red-50 text-rose-500" : 
                  t.type === "income" ? "bg-green-50 text-emerald-400" : "bg-blue-50 text-sky-400"
                )}>
                  {t.type === "expense" ? <ArrowDown className="w-6 h-6" /> : <ArrowUp className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-bold text-white text-sm md:text-base">{t.category}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                    <span>{new Date(t.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    {t.note && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="truncate max-w-[120px] md:max-w-xs">{t.note}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className={cn(
                    "font-bold text-sm md:text-base",
                    t.type === "expense" ? "text-white" : "text-emerald-400"
                  )}>
                    {t.type === "expense" ? "-" : "+"}{formatCurrency(t.amount)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mt-1">{t.type.replace('_', ' ')}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingTransaction(t)} className="p-2 text-zinc-500 hover:text-sky-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} disabled={isPending} className={cn("p-2 text-zinc-500 hover:text-rose-500 transition-colors", isPending && "opacity-50 cursor-not-allowed")}>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {editingTransaction && (
        <AddTransactionModal 
          initialData={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
        />
      )}
    </>
  );
}
