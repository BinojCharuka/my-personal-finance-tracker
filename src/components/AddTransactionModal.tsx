"use client";

import { useState, useTransition, useEffect } from "react";
import { X, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { addTransaction, updateTransaction, getPresets } from "@/lib/actions";
import { useRouter } from "next/navigation";

export type TransactionType = 'income' | 'expense' | 'savings_deposit' | 'savings_withdrawal';

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
  initialData?: any; 
}

export default function AddTransactionModal({ onClose, initialData }: Props) {
  const [type, setType] = useState<TransactionType>(initialData?.type || "expense");
  const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || "");
  const [category, setCategory] = useState(initialData?.category || EXPENSE_CATEGORIES[0]);
  const getLocalDateString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [date, setDate] = useState(initialData?.date || getLocalDateString());
  const [note, setNote] = useState(initialData?.note || "");
  const [isPending, startTransition] = useTransition();
  const [presets, setPresets] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!initialData) {
      getPresets().then(setPresets).catch(console.error);
    }
  }, [initialData]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    startTransition(async () => {
      try {
        const data = {
          amount: Number(amount),
          type,
          category,
          date,
          note,
        };
        
        if (initialData?.id) {
          await updateTransaction(initialData.id, data);
        } else {
          await addTransaction(data);
        }
        
        onClose();
        router.refresh();
      } catch (error) {
        console.error("Failed to add transaction", error);
      }
    });
  };

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1a1a]/60 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.8, y: 100, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-[#121212]/80 backdrop-blur-3xl rounded-[40px] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-transparent">
            <h2 className="font-semibold text-lg text-white">{initialData ? "Edit Transaction" : "New Transaction"}</h2>
            <button onClick={onClose} className="p-2 bg-[#1a1a1a] rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {presets.length > 0 && !initialData && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" /> Use Preset
              </label>
              <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
                {presets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setType(p.type as TransactionType);
                      setAmount(p.amount.toString());
                      setCategory(p.category);
                      setNote(p.note || "");
                    }}
                    className="whitespace-nowrap px-3 py-1.5 bg-[#1a1a1a] border border-zinc-700 rounded-lg text-xs font-medium text-zinc-300 hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex relative p-1 bg-white/5 rounded-full backdrop-blur-md border border-white/5">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={cn(
                "flex-1 relative py-3 rounded-full font-medium text-sm transition-colors z-10",
                type === "expense" ? "text-red-500" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Expense
              {type === "expense" && (
                <motion.div layoutId="type-pill" className="absolute inset-0 bg-[#1a1a1a] rounded-full -z-10 shadow-lg border border-white/5" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={cn(
                "flex-1 relative py-3 rounded-full font-medium text-sm transition-colors z-10",
                type === "income" ? "text-green-500" : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              Income
              {type === "income" && (
                <motion.div layoutId="type-pill" className="absolute inset-0 bg-[#1a1a1a] rounded-full -z-10 shadow-lg border border-white/5" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Amount (LKR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-medium">Rs.</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg font-medium backdrop-blur-sm text-white"
                required
                autoFocus
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-200">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm backdrop-blur-sm text-white appearance-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-200">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm backdrop-blur-sm text-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-200">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Lunch at campus"
              className="w-full px-5 py-3 bg-white/5 border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm backdrop-blur-sm text-white"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isPending}
            className={cn(
              "w-full py-4 rounded-full text-black font-bold shadow-[0_10px_40px_-10px_rgba(204,255,0,0.5)] transition-all flex items-center justify-center gap-2 mt-4 backdrop-blur-md",
              isPending ? "opacity-70 cursor-not-allowed" : "",
              type === "expense" ? "bg-primary hover:bg-primary/90" : "bg-emerald-500 hover:bg-emerald-400 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)]"
            )}
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {type === "expense" ? (isPending ? "Adding..." : "+ Add Expense") : (isPending ? "Adding..." : "+ Add Income")}
          </motion.button>
        </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
