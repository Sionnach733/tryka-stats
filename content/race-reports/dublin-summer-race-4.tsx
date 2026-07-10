import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

export const intro =
  "Dublin Summer Race 4 was the biggest Tryka event yet — 4,872 entries and roughly 8,143 athletes on the day, capping a season that has grown from 3,798 athletes at Autumn Race 1. Doubles ruled the entry list, women made up the majority of the field, and a single Doubles 500 pairing was the only crew to threaten 38 minutes.";

// ---- Overview ----
const ENTRIES_PER_DIVISION: { label: string; value: number }[] = [
  { label: "Doubles 500", value: 1807 },
  { label: "Doubles 800", value: 1323 },
  { label: "Open 800", value: 904 },
  { label: "Open 500", value: 658 },
  { label: "Pro", value: 91 },
  { label: "Pro Doubles", value: 63 },
  { label: "Relay", value: 26 },
];
const maxEntries = Math.max(...ENTRIES_PER_DIVISION.map((d) => d.value));

// ---- Overall time percentiles (99th = fastest 1%) ----
type Row = {
  division: string;
  gender: string;
  athletes: number;
  p25: string;
  p50: string;
  p75: string;
  p90: string;
  p95: string;
  p99: string;
};
const PERCENTILE_ROWS: Row[] = [
  { division: "Open 500", gender: "Men", athletes: 226, p25: "1:20:35", p50: "1:10:18", p75: "1:01:42", p90: "55:57", p95: "50:39", p99: "47:25" },
  { division: "Open 500", gender: "Women", athletes: 431, p25: "1:25:19", p50: "1:14:26", p75: "1:07:00", p90: "1:00:58", p95: "57:24", p99: "51:16" },
  { division: "Open 800", gender: "Men", athletes: 559, p25: "1:23:18", p50: "1:14:18", p75: "1:05:51", p90: "59:32", p95: "57:13", p99: "53:27" },
  { division: "Open 800", gender: "Women", athletes: 345, p25: "1:28:29", p50: "1:18:21", p75: "1:11:20", p90: "1:06:39", p95: "1:02:52", p99: "58:30" },
  { division: "Doubles 500", gender: "Men", athletes: 234, p25: "1:02:20", p50: "56:05", p75: "51:06", p90: "45:52", p95: "43:35", p99: "39:04" },
  { division: "Doubles 500", gender: "Women", athletes: 1107, p25: "1:12:37", p50: "1:06:30", p75: "1:00:34", p90: "56:44", p95: "54:46", p99: "50:32" },
  { division: "Doubles 500", gender: "Mixed", athletes: 466, p25: "1:11:03", p50: "1:03:34", p75: "57:21", p90: "52:12", p95: "49:07", p99: "43:38" },
  { division: "Doubles 800", gender: "Men", athletes: 422, p25: "1:10:33", p50: "1:04:30", p75: "59:26", p90: "53:35", p95: "51:15", p99: "45:53" },
  { division: "Doubles 800", gender: "Women", athletes: 555, p25: "1:18:29", p50: "1:12:33", p75: "1:07:00", p90: "1:01:03", p95: "58:13", p99: "54:26" },
  { division: "Doubles 800", gender: "Mixed", athletes: 345, p25: "1:16:50", p50: "1:10:06", p75: "1:03:36", p90: "57:09", p95: "53:31", p99: "48:29" },
  { division: "Pro Doubles", gender: "Men", athletes: 34, p25: "1:05:19", p50: "57:09", p75: "49:40", p90: "48:41", p95: "47:46", p99: "46:15" },
  { division: "Pro Doubles", gender: "Women", athletes: 29, p25: "1:09:57", p50: "1:03:42", p75: "1:01:27", p90: "52:35", p95: "52:23", p99: "51:46" },
  { division: "Pro", gender: "Men", athletes: 61, p25: "1:14:25", p50: "1:07:06", p75: "1:00:22", p90: "55:39", p95: "54:21", p99: "51:38" },
  { division: "Pro", gender: "Women", athletes: 30, p25: "1:29:22", p50: "1:26:35", p75: "1:16:00", p90: "1:03:44", p95: "59:54", p99: "59:39" },
  { division: "Relay", gender: "Women", athletes: 26, p25: "1:22:50", p50: "1:18:16", p75: "1:10:42", p90: "59:34", p95: "59:10", p99: "54:47" },
];

// ---- Running: pace per km by division (all athletes, run total / distance) ----
const PACE_ROWS: { label: string; paceSec: number; pace: string }[] = [
  { label: "Pro", paceSec: 300, pace: "5:00" },
  { label: "Pro Doubles", paceSec: 300, pace: "5:00" },
  { label: "Open 800", paceSec: 330, pace: "5:30" },
  { label: "Relay", paceSec: 338, pace: "5:38" },
  { label: "Doubles 800", paceSec: 342, pace: "5:42" },
  { label: "Open 500", paceSec: 396, pace: "6:36" },
  { label: "Doubles 500", paceSec: 415, pace: "6:55" },
];
const maxPace = Math.max(...PACE_ROWS.map((p) => p.paceSec));

type RunRow = { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string; pace: string };
const RUN_ROWS: RunRow[] = [
  { division: "Open 500", gender: "Men", athletes: 226, p25: "27:31", p50: "24:04", p75: "21:38", p90: "19:18", pace: "6:16" },
  { division: "Open 500", gender: "Women", athletes: 431, p25: "29:21", p50: "25:46", p75: "23:12", p90: "21:39", pace: "6:47" },
  { division: "Open 800", gender: "Men", athletes: 558, p25: "36:49", p50: "33:34", p75: "30:30", p90: "28:07", pace: "5:19" },
  { division: "Open 800", gender: "Women", athletes: 345, p25: "40:07", p50: "36:17", p75: "32:46", p90: "30:41", pace: "5:46" },
  { division: "Doubles 500", gender: "Men", athletes: 234, p25: "26:30", p50: "23:36", p75: "21:19", p90: "18:54", pace: "6:12" },
  { division: "Doubles 500", gender: "Women", athletes: 1105, p25: "30:28", p50: "27:12", p75: "24:58", p90: "23:23", pace: "7:12" },
  { division: "Doubles 500", gender: "Mixed", athletes: 465, p25: "28:07", p50: "25:30", p75: "23:18", p90: "21:02", pace: "6:38" },
  { division: "Doubles 800", gender: "Men", athletes: 422, p25: "37:01", p50: "34:03", p75: "31:32", p90: "28:25", pace: "5:25" },
  { division: "Doubles 800", gender: "Women", athletes: 555, p25: "40:35", p50: "37:19", p75: "34:34", p90: "32:00", pace: "5:58" },
  { division: "Doubles 800", gender: "Mixed", athletes: 345, p25: "39:21", p50: "35:52", p75: "32:56", p90: "29:56", pace: "5:40" },
  { division: "Pro Doubles", gender: "Men", athletes: 34, p25: "32:59", p50: "29:51", p75: "25:56", p90: "24:49", pace: "4:40" },
  { division: "Pro Doubles", gender: "Women", athletes: 29, p25: "34:13", p50: "32:26", p75: "30:44", p90: "27:08", pace: "5:24" },
  { division: "Pro", gender: "Men", athletes: 61, p25: "32:36", p50: "29:35", p75: "26:27", p90: "25:33", pace: "4:46" },
  { division: "Pro", gender: "Women", athletes: 30, p25: "38:27", p50: "35:07", p75: "32:10", p90: "28:08", pace: "5:28" },
  { division: "Relay", gender: "Women", athletes: 25, p25: "38:15", p50: "35:50", p75: "31:32", p90: "28:57", pace: "5:38" },
];

// ---- TRY Zone percentiles ----
const TRYZONE_ROWS: { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string }[] = [
  { division: "Open 500", gender: "Men", athletes: 225, p25: "8:18", p50: "6:42", p75: "5:15", p90: "4:14" },
  { division: "Open 500", gender: "Women", athletes: 429, p25: "8:07", p50: "6:37", p75: "5:25", p90: "4:33" },
  { division: "Open 800", gender: "Men", athletes: 557, p25: "6:58", p50: "5:34", p75: "4:21", p90: "3:38" },
  { division: "Open 800", gender: "Women", athletes: 345, p25: "6:51", p50: "5:29", p75: "4:29", p90: "3:54" },
  { division: "Doubles 500", gender: "Men", athletes: 234, p25: "7:24", p50: "6:00", p75: "4:47", p90: "4:01" },
  { division: "Doubles 500", gender: "Women", athletes: 1103, p25: "8:07", p50: "6:47", p75: "5:46", p90: "4:54" },
  { division: "Doubles 500", gender: "Mixed", athletes: 464, p25: "7:49", p50: "6:38", p75: "5:26", p90: "4:18" },
  { division: "Doubles 800", gender: "Men", athletes: 422, p25: "6:23", p50: "5:00", p75: "4:09", p90: "3:28" },
  { division: "Doubles 800", gender: "Women", athletes: 555, p25: "6:51", p50: "5:36", p75: "4:39", p90: "3:55" },
  { division: "Doubles 800", gender: "Mixed", athletes: 345, p25: "6:44", p50: "5:18", p75: "4:22", p90: "3:39" },
  { division: "Pro Doubles", gender: "Men", athletes: 34, p25: "5:08", p50: "3:58", p75: "3:09", p90: "2:56" },
  { division: "Pro Doubles", gender: "Women", athletes: 29, p25: "5:15", p50: "4:04", p75: "3:39", p90: "3:24" },
  { division: "Pro", gender: "Men", athletes: 61, p25: "5:08", p50: "4:03", p75: "3:29", p90: "3:19" },
  { division: "Pro", gender: "Women", athletes: 30, p25: "6:58", p50: "5:41", p75: "4:49", p90: "3:38" },
  { division: "Relay", gender: "Women", athletes: 25, p25: "5:21", p50: "4:45", p75: "4:19", p90: "3:46" },
];

// ---- Stations (median seconds per division x gender) ----
const STATIONS: StationsByDivision[] = [
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 277 }, { gender: "Women", sec: 320 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 115 }, { gender: "Women", sec: 118 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 271 }, { gender: "Women", sec: 245 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 178 }, { gender: "Women", sec: 154 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 435 }, { gender: "Women", sec: 488 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 327 }, { gender: "Women", sec: 360 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 339 }, { gender: "Women", sec: 324 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 367 }, { gender: "Women", sec: 446 }] },
    ],
  },
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 270 }, { gender: "Women", sec: 310 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 106 }, { gender: "Women", sec: 110 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 239 }, { gender: "Women", sec: 220 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 165 }, { gender: "Women", sec: 144 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 363 }, { gender: "Women", sec: 411 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 305 }, { gender: "Women", sec: 341 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 294 }, { gender: "Women", sec: 277 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 297 }, { gender: "Women", sec: 357 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 245 }, { gender: "Women", sec: 294 }, { gender: "Mixed", sec: 266 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 97 }, { gender: "Women", sec: 108 }, { gender: "Mixed", sec: 105 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 172 }, { gender: "Women", sec: 185 }, { gender: "Mixed", sec: 199 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 101 }, { gender: "Women", sec: 99 }, { gender: "Mixed", sec: 121 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 258 }, { gender: "Women", sec: 339 }, { gender: "Mixed", sec: 328 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 294 }, { gender: "Women", sec: 342 }, { gender: "Mixed", sec: 320 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 210 }, { gender: "Women", sec: 227 }, { gender: "Mixed", sec: 247 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 197 }, { gender: "Women", sec: 298 }, { gender: "Mixed", sec: 249 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 241 }, { gender: "Women", sec: 284 }, { gender: "Mixed", sec: 256 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 88 }, { gender: "Women", sec: 98 }, { gender: "Mixed", sec: 96 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 164 }, { gender: "Women", sec: 172 }, { gender: "Mixed", sec: 181 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 97 }, { gender: "Women", sec: 93 }, { gender: "Mixed", sec: 113 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 243 }, { gender: "Women", sec: 309 }, { gender: "Mixed", sec: 304 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 283 }, { gender: "Women", sec: 324 }, { gender: "Mixed", sec: 301 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 200 }, { gender: "Women", sec: 202 }, { gender: "Mixed", sec: 226 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 188 }, { gender: "Women", sec: 256 }, { gender: "Mixed", sec: 220 }] },
    ],
  },
  {
    division: "Pro Doubles",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 232 }, { gender: "Women", sec: 261 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 100 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 161 }, { gender: "Women", sec: 169 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 115 }, { gender: "Women", sec: 121 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 241 }, { gender: "Women", sec: 320 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 261 }, { gender: "Women", sec: 293 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 209 }, { gender: "Women", sec: 207 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 141 }, { gender: "Women", sec: 182 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 257 }, { gender: "Women", sec: 298 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 101 }, { gender: "Women", sec: 138 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 254 }, { gender: "Women", sec: 303 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 194 }, { gender: "Women", sec: 210 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 361 }, { gender: "Women", sec: 538 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 279 }, { gender: "Women", sec: 322 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 278 }, { gender: "Women", sec: 328 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 218 }, { gender: "Women", sec: 336 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Women", sec: 332 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Women", sec: 114 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Women", sec: 218 }] },
      { station: "Sled Push", rows: [{ gender: "Women", sec: 109 }] },
      { station: "Sled Pull", rows: [{ gender: "Women", sec: 437 }] },
      { station: "Rowing", rows: [{ gender: "Women", sec: 339 }] },
      { station: "Lunges", rows: [{ gender: "Women", sec: 257 }] },
      { station: "Burpees", rows: [{ gender: "Women", sec: 353 }] },
    ],
  },
];

function TimeTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">Athletes</th>
            <th className="px-3 py-2 text-right">25th</th>
            <th className="px-3 py-2 text-right">50th</th>
            <th className="px-3 py-2 text-right">75th</th>
            <th className="px-3 py-2 text-right">90th</th>
            <th className="px-3 py-2 text-right">95th</th>
            <th className="px-3 py-2 text-right">99th</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {rows.map((r) => (
            <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
              <td className="whitespace-nowrap px-3 py-2">{r.division}</td>
              <td className="px-3 py-2">{r.gender}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.athletes}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p25}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p75}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p90}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p95}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p99}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DublinSummerRace4Report() {
  return (
    <div className="space-y-10">
      {/* ---- Key Insights ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key Insights
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            The largest Tryka field on record: <span className="tabular-nums">4,872</span> entries and
            roughly <span className="tabular-nums">8,143</span> athletes — up from{" "}
            <span className="tabular-nums">3,798</span> at Autumn Race 1 four races ago.
          </li>
          <li>
            Women were the majority of the field —{" "}
            <span className="tabular-nums">2,523</span> entries versus{" "}
            <span className="tabular-nums">1,536</span> men and{" "}
            <span className="tabular-nums">811</span> mixed teams.
          </li>
          <li>
            Only three entries broke <span className="tabular-nums">40:00</span>, and all three were
            Doubles 500 men. Adam Prunty appears in two of them.
          </li>
          <li>
            Sled Pull was the great separator: Open 500 women spent a median{" "}
            <span className="tabular-nums">8:08</span> on it — more than their entire TRY Zone — while
            Pro women bottomed out at <span className="tabular-nums">8:58</span> at the 25th percentile.
          </li>
          <li>
            Pace, not stations, defines the Pro divisions: Pro and Pro Doubles men both averaged{" "}
            <span className="tabular-nums">5:00/km</span> across the runs, over a minute per km quicker
            than the Doubles 500 field.
          </li>
        </ul>
      </section>

      {/* ---- By the numbers ---- */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Athletes</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">8,143</div>
            <div className="mt-1 text-xs text-slate-400">across 4,872 entries</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest finish</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">38:10</div>
            <div className="mt-1 text-xs text-slate-400">A. Prunty / D. Maher — Doubles 500</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Biggest division</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">1,807</div>
            <div className="mt-1 text-xs text-slate-400">Doubles 500 entries</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest sprint</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">0:06</div>
            <div className="mt-1 text-xs text-slate-400">J. Mullane / J. Fitzgerald — Pro Doubles</div>
          </div>
        </div>
      </section>

      {/* ---- Race overview ---- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Race overview
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Seven divisions raced. Doubles dominated the entry list — the two Doubles formats accounted
          for <span className="tabular-nums">3,130</span> of the{" "}
          <span className="tabular-nums">4,872</span> entries, more than double the combined Open
          fields. The elite Pro and Pro Doubles divisions stayed small at{" "}
          <span className="tabular-nums">91</span> and <span className="tabular-nums">63</span> entries,
          and the Relay was a niche <span className="tabular-nums">26</span> teams — all women. The most
          common age band was 30–39, with a big 40–49 contingent close behind.
        </p>
        <svg
          viewBox={`0 0 600 ${ENTRIES_PER_DIVISION.length * 26 + 20}`}
          className="w-full"
          role="img"
          aria-label="Entries per division"
        >
          <g transform="translate(120, 10)">
            {ENTRIES_PER_DIVISION.map((d, i) => {
              const w = Math.round((d.value / maxEntries) * 380);
              const y = i * 26;
              return (
                <g key={d.label}>
                  <text x={-10} y={y + 18} textAnchor="end" fill="#94a3b8" fontSize="11">
                    {d.label}
                  </text>
                  <rect x={0} y={y + 6} width={w} height={16} fill="#06e38b" />
                  <text x={w + 8} y={y + 18} fill="#ffffff" fontSize="11" className="tabular-nums">
                    {d.value.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        <p className="mt-2 text-xs text-slate-500">Entries per division (a Doubles entry = two athletes; a Relay entry = four).</p>
      </section>

      {/* ---- Division performance ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Division performance
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Overall-time percentiles, CrossFit-Open style: read left-to-right from the field&apos;s slower
          end to its sharp end. The 99th column is the time posted by the fastest 1% of each group; the
          25th is a bottom-quartile day. Doubles 500 men had both the quickest elite times and the
          widest spread — a <span className="tabular-nums">39:04</span> at the 99th against a{" "}
          <span className="tabular-nums">1:02:20</span> at the 25th.
        </p>
        <TimeTable rows={PERCENTILE_ROWS} />
      </section>

      {/* ---- Running ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Running performance
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Run totals below cover the full running distance (4&nbsp;km for 500 formats, 6.4&nbsp;km for
          800 formats), so compare within a format, not across — the pace column is the honest
          cross-division measure. The Pro divisions set the standard: Pro Doubles men averaged{" "}
          <span className="tabular-nums">4:40/km</span> and Pro men{" "}
          <span className="tabular-nums">4:46/km</span>, while the huge Doubles 500 women&apos;s field
          sat at <span className="tabular-nums">7:12/km</span>.
        </p>
        <div className="mb-6 overflow-x-auto rounded-lg border border-tryka-navy-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2">Gender</th>
                <th className="px-3 py-2 text-right">Athletes</th>
                <th className="px-3 py-2 text-right">25th</th>
                <th className="px-3 py-2 text-right">50th</th>
                <th className="px-3 py-2 text-right">75th</th>
                <th className="px-3 py-2 text-right">90th</th>
                <th className="px-3 py-2 text-right">Avg pace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tryka-navy-light">
              {RUN_ROWS.map((r) => (
                <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
                  <td className="whitespace-nowrap px-3 py-2">{r.division}</td>
                  <td className="px-3 py-2">{r.gender}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.athletes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p25}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p75}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p90}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.pace}/km</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-tryka-navy-light px-3 py-2 text-xs text-slate-500">
            25th–90th columns are Run Total (mm:ss) over the division&apos;s full run distance; Avg pace is per km.
          </p>
        </div>
        <h3 className="mb-3 text-xs uppercase tracking-wide text-slate-400">Average run pace per km, by division</h3>
        <svg
          viewBox={`0 0 600 ${PACE_ROWS.length * 26 + 20}`}
          className="w-full"
          role="img"
          aria-label="Average run pace per km by division"
        >
          <g transform="translate(120, 10)">
            {PACE_ROWS.map((d, i) => {
              const w = Math.round((d.paceSec / maxPace) * 380);
              const y = i * 26;
              return (
                <g key={d.label}>
                  <text x={-10} y={y + 18} textAnchor="end" fill="#94a3b8" fontSize="11">
                    {d.label}
                  </text>
                  <rect x={0} y={y + 6} width={w} height={16} fill="#06e38b" />
                  <text x={w + 8} y={y + 18} fill="#ffffff" fontSize="11" className="tabular-nums">
                    {d.pace}/km
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </section>

      {/* ---- TRY Zone ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          TRY Zone
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          The TRY Zone is the back-half burn where runs and stations interleave, and it&apos;s where the
          elite divisions put daylight between themselves and everyone else. Pro Doubles men closed it in
          a median <span className="tabular-nums">3:58</span> — their fastest 10% dipped under{" "}
          <span className="tabular-nums">3:00</span> — against a median{" "}
          <span className="tabular-nums">6:47</span> for Doubles 500 women. The 800 formats consistently
          cleared the zone quicker than their 500 counterparts.
        </p>
        <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2">Gender</th>
                <th className="px-3 py-2 text-right">Athletes</th>
                <th className="px-3 py-2 text-right">25th</th>
                <th className="px-3 py-2 text-right">50th</th>
                <th className="px-3 py-2 text-right">75th</th>
                <th className="px-3 py-2 text-right">90th</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tryka-navy-light">
              {TRYZONE_ROWS.map((r) => (
                <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
                  <td className="whitespace-nowrap px-3 py-2">{r.division}</td>
                  <td className="px-3 py-2">{r.gender}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.athletes}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p25}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p75}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.p90}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- Workout stations ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Workout stations
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Median time on each of the eight stations, split by gender. Pick a division to see its full
          profile. Two patterns recur everywhere: Sled Pull is the single biggest time sink — routinely
          three to four times longer than the Sled Push right before it — and the Burpees gap between men
          and women is the widest gender split of any station. Note that Doubles crews share the reps
          between two athletes, so their station times run far shorter than the individual Open formats;
          compare formats by shape, not by raw seconds.
        </p>
        <StationPicker divisions={STATIONS} />
      </section>

      {/* ---- Sprint finish ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Sprint finish
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          The dash to the line ran a median of just <span className="tabular-nums">12</span> seconds.
          The quickest closer was the Pro Doubles pair Jack Mullane and John Fitzgerald at{" "}
          <span className="tabular-nums">0:06</span> — proof there was still something in the tank after
          6.4&nbsp;km and eight stations.
        </p>
      </section>

      {/* ---- Key takeaways ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key takeaways
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Tryka&apos;s growth is relentless — the fourth Dublin race drew more than twice the athletes
            of the first, and Doubles is the engine, supplying nearly two-thirds of every start slot.
          </li>
          <li>
            The Pro divisions aren&apos;t winning on the stations — their edge is running. A flat{" "}
            <span className="tabular-nums">5:00/km</span> average and a sub-3:00 TRY Zone are where the
            elite race is decided.
          </li>
          <li>
            If you want to find time, look at the sleds. Sled Pull alone swallowed 7–9 minutes for
            mid-pack athletes — more than any run segment — and it&apos;s where the field spread out most.
          </li>
        </ul>
      </section>
    </div>
  );
}
