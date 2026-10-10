"use client";

import { useState, useTransition } from "react";
import { Plus, Zap, ArrowDown, ArrowUp, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { usePreset, deletePreset } from "@/lib/actions";
import AddPresetModal from "./AddPresetModal";

export default function ClientPresets({ initialPresets }: { initialPresets: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [successId, setSuccessId] = useState<number | null>(null);

  const handleUsePreset = (id: number) => {
    startTransition(async () => {
      await usePreset(id);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this preset?")) {
      startTransition(async () => {
        await deletePreset(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-4 bg-primary text-black rounded-2xl font-bold tracking-wide shadow-none hover:bg-[#bfff00] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create New Preset
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {initialPresets.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-[#121212] border border-zinc-800 rounded-2xl">
            <Zap className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No presets created yet.<br/>Add your daily bus ticket or lunch here!</p>
          </div>
        ) : (
          initialPresets.map(p => (
            <div key={p.id} className="bg-[#121212] p-5 rounded-2xl border border-zinc-800 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    p.type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-400/10 text-emerald-400"
                  )}>
                    {p.type === "expense" ? <ArrowDown className="w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{p.name}</h3>
                    <p className="text-xs text-zinc-500">{p.category} {p.note ? `• ${p.note}` : ""}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  disabled={isPending}
                  className="text-zinc-600 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/50">
                <span className={cn(
                  "font-bold text-lg",
                  p.type === "expense" ? "text-white" : "text-emerald-400"
                )}>
                  {p.type === "expense" ? "-" : "+"}{formatCurrency(p.amount)}
                </span>
                
                <button
                  onClick={() => handleUsePreset(p.id)}
                  disabled={isPending || successId === p.id}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all",
                    successId === p.id 
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-[#1a1a1a] text-white hover:bg-[#262626] border border-zinc-700"
                  )}
                >
                  {successId === p.id ? (
                    <>Added! <CheckCircle2 className="w-4 h-4" /></>
                  ) : isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Quick Add <Zap className="w-4 h-4 text-primary" /></>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <AddPresetModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
