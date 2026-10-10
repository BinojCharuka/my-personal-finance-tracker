"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";
import { deleteTransaction } from "@/lib/actions";
import AddTransactionModal from "./AddTransactionModal";

export default function ClientTransactionList({ transactions, todaysSpending }: { transactions: any[], todaysSpending: number }) {
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      startTransition(async () => {
        await deleteTransaction(id);
      });
    }
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-bold text-white">Today's Spending</h3>
        <span className="text-zinc-400 font-medium">{formatCurrency(todaysSpending)}</span>
      </div>
      
      <div className="bg-[#121212] rounded-2xl shadow-none border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/50">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-medium text-sm">
            No transactions for today.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
          {transactions.map((t, idx) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 25, delay: idx * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              key={t.id} 
              className="p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  t.type === "expense" ? "bg-red-50 text-rose-500" : "bg-green-50 text-emerald-400"
                )}>
                  {t.type === "expense" ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm md:text-base">{t.category}</p>
                  {t.note && <p className="text-xs text-zinc-500">{t.note}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-bold",
                  t.type === "expense" ? "text-white" : "text-emerald-400"
                )}>
                  {t.type === "expense" ? "-" : "+"}{formatCurrency(t.amount)}
                </span>
                
                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditingTransaction(t)} className="p-2 text-zinc-500 hover:text-sky-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} disabled={isPending} className={cn("p-2 text-zinc-500 hover:text-rose-500 transition-colors", isPending && "opacity-50 cursor-not-allowed")}>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        )}
      </div>
      
      {editingTransaction && (
        <AddTransactionModal 
          initialData={editingTransaction} 
          onClose={() => setEditingTransaction(null)} 
        />
      )}
    </div>
  );
}
