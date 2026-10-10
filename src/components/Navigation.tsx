"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, List, PlusCircle, BarChart3, PiggyBank, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AddTransactionModal from "./AddTransactionModal";

export default function Navigation() {
  const pathname = usePathname();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: List },
    { type: "button", label: "Add", icon: PlusCircle, onClick: () => setIsAddModalOpen(true) },
    { href: "/reports", label: "Reports", icon: BarChart3 },
    { href: "/savings", label: "Savings", icon: PiggyBank },
    { href: "/presets", label: "Presets", icon: Zap },
  ];

  return (
    <>
      <nav className="fixed bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-auto bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-full md:rounded-none z-40 md:w-64 md:top-0 md:border-t-0 md:border-r md:border-zinc-800/80 flex md:flex-col md:pb-0 px-2 sm:px-6 md:px-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:shadow-none md:bg-[#0a0a0a]">
        <div className="hidden md:block p-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Expense Tracker</h1>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden w-full justify-between items-center py-2 relative h-16">
          {links.filter(l => l.href !== "/presets").map((link, idx) => {
            const Icon = link.icon;
            
            if (link.type === "button") {
              return (
                <div key={idx} className="flex-1 flex justify-center py-1.5">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={link.onClick}
                    className="w-11 h-11 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.4)]"
                  >
                    <Icon className="w-5 h-5 stroke-[3px]" />
                  </motion.button>
                </div>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href!}
                className="flex-1 flex justify-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 transition-colors",
                    isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full flex-col gap-2 px-4 mt-6">
          {links.map((link, idx) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            if (link.type === "button") {
              return (
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  key={idx}
                  onClick={link.onClick}
                  className="flex items-center gap-3 p-3 text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors focus:outline-none w-full"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{link.label}</span>
                </motion.button>
              );
            }

            return (
              <Link key={idx} href={link.href!} className="w-full block">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-colors duration-200",
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                  <span className="text-sm">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
      {isAddModalOpen && <AddTransactionModal onClose={() => setIsAddModalOpen(false)} />}
    </>
  );
}
