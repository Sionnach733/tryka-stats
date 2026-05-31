// Station movement standards and weights from the official Tryka rulebook.
// Server component — no state needed, this is static reference content.

type WeightTiers = {
  openW: string;
  openM: string;
  proW: string;
  proM: string;
};

type StationDef = {
  name: string;
  target: string;
  standards: string[];
  weights: WeightTiers | null;
};

const STATIONS: StationDef[] = [
  {
    name: "SkiErg",
    target: "1,000 m",
    standards: [
      "Stay on the platform throughout; damper is adjustable.",
      "Raise hand on completion — a judge must confirm before you leave.",
    ],
    weights: null,
  },
  {
    name: "KB Farmers Carry",
    target: "200 m",
    standards: [
      "Carry both kettlebells at the sides, arms extended, handles outside the thighs.",
      "KBs may be set down to rest. Station ends when you cross the finish line with both.",
    ],
    weights: { openW: "16 kg × 2", openM: "24 kg × 2", proW: "24 kg × 2", proM: "32 kg × 2" },
  },
  {
    name: "RAM Thrusters",
    target: "60 reps",
    standards: [
      "Squat to parallel (below parallel for Pro); full extension overhead at the top.",
      "Press Start on the AI judging screen before your first rep — missed reps won't count.",
    ],
    weights: { openW: "8.5 kg", openM: "15 kg", proW: "15 kg", proM: "20 kg" },
  },
  {
    name: "Sled Push",
    target: "4 × 12.5 m",
    standards: [
      "Push from behind the sled; stay in your designated lane.",
      "The entire sled must cross the line at each 12.5 m mark before you turn.",
    ],
    weights: { openW: "100 kg", openM: "150 kg", proW: "150 kg", proM: "200 kg" },
  },
  {
    name: "Sled Pull",
    target: "4 × 12.5 m",
    standards: [
      "Stay inside the 1 m box — you cannot step on any of its four lines.",
      "Hand-over-hand pull; must stay standing at all times.",
    ],
    weights: { openW: "75 kg", openM: "100 kg", proW: "100 kg", proM: "150 kg" },
  },
  {
    name: "Rowing Machine",
    target: "1,000 m",
    standards: [
      "Feet secured in straps before grabbing the handle; damper is adjustable.",
      "Raise hand on completion — a judge must confirm before you leave.",
    ],
    weights: null,
  },
  {
    name: "Weighted Lunges",
    target: "100 m",
    standards: [
      "RAM on upper back; trailing knee must touch the ground each rep. Stand upright between reps.",
      "Alternate legs with no shuffles or extra steps. RAM must not touch the ground.",
    ],
    weights: { openW: "10 kg", openM: "20 kg", proW: "20 kg", proM: "30 kg" },
  },
  {
    name: "Burpee Broad Jumps",
    target: "80 m",
    standards: [
      "Chest to floor on each burpee; feet parallel on takeoff.",
      "Controlled landing with both feet parallel — no shuffle steps between reps.",
    ],
    weights: null,
  },
];

const WEIGHT_COLS: { key: keyof WeightTiers; label: string }[] = [
  { key: "openW", label: "Open W" },
  { key: "openM", label: "Open M + Mixed" },
  { key: "proW", label: "Pro W" },
  { key: "proM", label: "Pro M" },
];

export default function StationStandards() {
  return (
    <div>
      <h3 className="mb-3 mt-8 text-xs uppercase tracking-wide text-slate-400">
        Movement standards &amp; weights
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STATIONS.map((s) => (
          <div
            key={s.name}
            className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4"
          >
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-white">{s.name}</span>
              <span className="text-xs tabular-nums text-tryka-green">{s.target}</span>
            </div>
            <ul className="mb-0 space-y-1">
              {s.standards.map((rule, i) => (
                <li key={i} className="text-xs leading-snug text-slate-400">
                  {rule}
                </li>
              ))}
            </ul>
            {s.weights && (
              <table className="mt-3 w-full text-xs tabular-nums">
                <thead>
                  <tr>
                    {WEIGHT_COLS.map((c) => (
                      <th
                        key={c.key}
                        className="pb-1 text-left text-[10px] uppercase tracking-wide text-slate-500"
                      >
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {WEIGHT_COLS.map((c) => (
                      <td key={c.key} className="text-slate-300">
                        {s.weights![c.key]}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
