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
