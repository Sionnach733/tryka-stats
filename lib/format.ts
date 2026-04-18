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

/** Format seconds as "MM:SS". */
export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
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

/** Format a pace as "M:SS /km". */
export function formatPace(totalSeconds: number, distanceKm: number): string {
  const paceSeconds = totalSeconds / distanceKm;
  const m = Math.floor(paceSeconds / 60);
  const s = Math.round(paceSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}
