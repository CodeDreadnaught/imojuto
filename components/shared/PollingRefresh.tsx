"use client";

import { usePolling } from "@/lib/hooks/usePolling";

export function PollingRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  usePolling(intervalMs);
  return null;
}
