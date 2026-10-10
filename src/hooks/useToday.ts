import { useState, useEffect } from "react";

export function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    setToday(new Date());
  }, []);
  
  return today;
}
