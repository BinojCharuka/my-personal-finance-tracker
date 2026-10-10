"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { addPreset } from "@/lib/actions";

export type TransactionType = 'income' | 'expense';

const EXPENSE_CATEGORIES = [
  "Food",
  "Drinks/Snacks",
  "Transport",
  "University/Campus",
  "Shopping",
  "Entertainment",
  "Other"
];

const INCOME_CATEGORIES = [
  "Allowance",
  "Extra Money",
  "Refund",
  "Other"
];

interface Props {
  onClose: () => void;
}

export default function AddPresetModal({ onClose }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || !name) return;
    
    startTransition(async () => {
      try {
        await addPreset({
          name,
          amount: Number(amount),
          type,
          category,
          note,
        });
        
        onClose();
      } catch (error) {
        console.error("Failed to add preset", error);
      }
    });
  };

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/50 backdrop-blur-sm p-4">
      <div className="bg-[#121212] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#0a0a0a]">
          <h2 className="font-semibold text-lg text-white">Create Preset</h2>
          <button onClick={onClose} className="p-2 bg-[#121212] rounded-full text-zinc-500 hover:text-white shadow-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Preset Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Daily Bus Ticket"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-white"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-2 p-1 bg-[#1a1a1a] rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
                type === "expense" ? "bg-[#121212] text-rose-500 shadow-none" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={cn(
                "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
                type === "income" ? "bg-[#121212] text-emerald-400 shadow-none" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Income
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-200">Amount (LKR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rs.</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium text-white"
                  required
                  inputMode="decimal"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-200">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Bus 138"
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full py-3.5 rounded-xl text-black font-bold tracking-wide shadow-none transition-all flex items-center justify-center gap-2 mt-2 bg-primary hover:bg-[#bfff00]",
              isPending ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"
            )}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isPending ? "Saving Preset..." : "Save Preset"}
          </button>
        </form>
      </div>
    </div>
  );
}
