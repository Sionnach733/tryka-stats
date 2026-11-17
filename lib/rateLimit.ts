// Simple fixed-window in-memory rate limiter (single pm2 process).
export function createRateLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function isLimited(key: string): boolean {
    const t = Date.now();
    const entry = hits.get(key);
    if (!entry || t >= entry.resetAt) {
      if (hits.size > 10_000) hits.clear();
      hits.set(key, { count: 1, resetAt: t + windowMs });
      return false;
    }
    entry.count++;
    return entry.count > max;
  };
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
