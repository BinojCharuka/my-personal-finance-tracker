"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center relative">
      <div className="relative flex items-center justify-center">
        {/* Glowing background blur */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-32 h-32 bg-primary rounded-full blur-3xl"
        />
        
        {/* Center Liquid dots */}
        <div className="flex items-center gap-2 z-10 relative">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                height: ["12px", "32px", "12px"],
                backgroundColor: ["#2a2a2a", "#ccff00", "#2a2a2a"]
              }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.15
              }}
              className="w-3 rounded-full bg-[#2a2a2a] shadow-[0_0_15px_rgba(204,255,0,0.2)]"
            />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 flex flex-col items-center"
      >
        <span className="text-white font-bold tracking-[0.2em] text-xs uppercase">Expense Tracker</span>
        <span className="text-zinc-500 text-xs mt-2 font-medium">Organizing your data...</span>
      </motion.div>
    </div>
  );
}
