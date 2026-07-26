"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function usePolling(intervalMs = 15000) {
  const router = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => router.refresh(), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, router]);
}
