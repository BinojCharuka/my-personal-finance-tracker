"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RealtimeRefresher() {
  const router = useRouter();

  useEffect(() => {
    // Poll the server every 5 seconds to get the latest data
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
