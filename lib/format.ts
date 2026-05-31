export function parseMembers(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function displayMembers(members: string[]): string {
  return members.length ? members.join(" / ") : "—";
}

export function displayGender(g: string | null | undefined): string {
  if (g === "M") return "Men";
  if (g === "W") return "Women";
  if (g === "X") return "Mixed";
  return "—";
}

/** Parse "HH:MM:SS" or "MM:SS" to total seconds, or null if invalid. */
export function parseTime(t: string | null | undefined): number | null {
  if (!t) return null;
  const parts = t.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Format seconds as "MM:SS". */
export function formatMmSs(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const m = Math.floor(rounded / 60);
  const s = rounded % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Compute a Kernel Density Estimate over a fixed x-range.
 * Returns an array of { x, density } points for plotting.
 * Uses a Gaussian kernel with Silverman's rule-of-thumb bandwidth.
 */
export function computeKde(
  fieldTimes: number[],
  xMin: number,
  xMax: number,
  numPoints: number = 100,
): { x: number; density: number }[] {
  if (fieldTimes.length === 0) return [];

  const n = fieldTimes.length;
  const mean = fieldTimes.reduce((s, v) => s + v, 0) / n;
  const variance = fieldTimes.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance) || 1;
  // Silverman's rule of thumb
  const bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);

  const range = xMax - xMin || 1;
  const step = range / (numPoints - 1);

  const points: { x: number; density: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    let sum = 0;
    for (const t of fieldTimes) {
      const z = (x - t) / bandwidth;
      sum += Math.exp(-0.5 * z * z);
    }
    points.push({ x, density: sum / (n * bandwidth * Math.sqrt(2 * Math.PI)) });
  }
  return points;
}

/** Format a time difference with sign prefix. Returns "+M:SS", "-M:SS", or "0:00". */
export function formatDiff(seconds: number): string {
  if (seconds === 0) return "0:00";
  const sign = seconds > 0 ? "+" : "-";
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.round(abs % 60);
  if (h > 0) {
    return `${sign}${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${sign}${m}:${String(s).padStart(2, "0")}`;
}

/** Format a pace as "M:SS /km". */
export function formatPace(totalSeconds: number, distanceKm: number): string {
  const paceSeconds = Math.round(totalSeconds / distanceKm);
  const m = Math.floor(paceSeconds / 60);
  const s = paceSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")} /km`;
}
