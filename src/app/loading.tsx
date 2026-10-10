import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
      <p className="text-zinc-400 font-medium animate-pulse">Loading your data...</p>
    </div>
  );
}
