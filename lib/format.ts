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

/** Format a pace as "M:SS /km". */
export function formatPace(totalSeconds: number, distanceKm: number): string {
  const paceSeconds = totalSeconds / distanceKm;
  const m = Math.floor(paceSeconds / 60);
  const s = Math.round(paceSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}
