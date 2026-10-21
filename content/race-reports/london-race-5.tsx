import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

export const intro =
  "London Race 5, Tryka's first race outside Dublin, brought 1,202 entries and roughly 1,900 athletes to London. It produced the fastest finish of the season so far — a 36:18 Doubles 500 run by a pair who had already raced Open 800 earlier that day — and an Open 800 field where the median man and median woman finished just 14 seconds apart.";

// ---- Overview ----
// Nine placeholder Relay rows (members listed as "1", "2", "3", "4") are excluded throughout.
const ENTRIES_PER_DIVISION: { label: string; value: number }[] = [
  { label: "Doubles 500", value: 320 },
  { label: "Doubles 800", value: 317 },
  { label: "Open 800", value: 297 },
  { label: "Open 500", value: 197 },
  { label: "Pro", value: 34 },
  { label: "Pro Doubles", value: 24 },
  { label: "Relay", value: 13 },
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
  { division: "Open 500", gender: "Men", athletes: 77, p25: "1:15:14", p50: "1:04:45", p75: "57:19", p90: "52:27", p95: "51:41", p99: "45:21" },
  { division: "Open 500", gender: "Women", athletes: 120, p25: "1:18:54", p50: "1:10:08", p75: "1:02:37", p90: "54:10", p95: "52:14", p99: "48:40" },
  { division: "Open 800", gender: "Men", athletes: 189, p25: "1:18:50", p50: "1:10:34", p75: "59:43", p90: "54:15", p95: "52:48", p99: "47:40" },
  { division: "Open 800", gender: "Women", athletes: 108, p25: "1:21:10", p50: "1:10:48", p75: "1:04:35", p90: "57:53", p95: "56:02", p99: "53:14" },
  { division: "Doubles 500", gender: "Men", athletes: 42, p25: "57:13", p50: "52:56", p75: "45:34", p90: "40:07", p95: "38:11", p99: "36:18" },
  { division: "Doubles 500", gender: "Women", athletes: 166, p25: "1:08:59", p50: "1:01:03", p75: "54:30", p90: "49:48", p95: "46:13", p99: "43:37" },
  { division: "Doubles 500", gender: "Mixed", athletes: 112, p25: "1:02:49", p50: "56:52", p75: "51:42", p90: "48:16", p95: "44:36", p99: "41:38" },
  { division: "Doubles 800", gender: "Men", athletes: 92, p25: "1:03:41", p50: "57:57", p75: "54:00", p90: "50:31", p95: "46:49", p99: "45:41" },
  { division: "Doubles 800", gender: "Women", athletes: 105, p25: "1:13:10", p50: "1:06:50", p75: "59:41", p90: "56:33", p95: "55:00", p99: "52:32" },
  { division: "Doubles 800", gender: "Mixed", athletes: 120, p25: "1:11:07", p50: "1:04:35", p75: "56:58", p90: "51:47", p95: "49:21", p99: "46:55" },
  { division: "Pro Doubles", gender: "Men", athletes: 11, p25: "57:13", p50: "51:27", p75: "49:05", p90: "49:04", p95: "46:51", p99: "46:51" },
  { division: "Pro Doubles", gender: "Women", athletes: 13, p25: "59:24", p50: "57:41", p75: "53:14", p90: "52:00", p95: "51:14", p99: "51:14" },
  { division: "Pro", gender: "Men", athletes: 13, p25: "1:03:44", p50: "59:57", p75: "58:50", p90: "56:54", p95: "52:21", p99: "52:21" },
  { division: "Pro", gender: "Women", athletes: 21, p25: "1:20:17", p50: "1:13:55", p75: "1:07:18", p90: "1:00:09", p95: "58:21", p99: "55:29" },
  { division: "Relay", gender: "Mixed", athletes: 9, p25: "1:05:41", p50: "1:02:13", p75: "55:07", p90: "49:29", p95: "49:29", p99: "49:29" },
];

// ---- Running: pace per km by division (all entries, run total / distance) ----
const PACE_ROWS: { label: string; paceSec: number; pace: string }[] = [
  { label: "Relay", paceSec: 264, pace: "4:24" },
  { label: "Pro Doubles", paceSec: 268, pace: "4:28" },
  { label: "Pro", paceSec: 300, pace: "5:00" },
  { label: "Open 800", paceSec: 316, pace: "5:16" },
  { label: "Doubles 800", paceSec: 321, pace: "5:21" },
  { label: "Open 500", paceSec: 388, pace: "6:28" },
  { label: "Doubles 500", paceSec: 390, pace: "6:30" },
];
const maxPace = Math.max(...PACE_ROWS.map((p) => p.paceSec));

type RunRow = { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string; pace: string };
const RUN_ROWS: RunRow[] = [
  { division: "Open 500", gender: "Men", athletes: 77, p25: "27:39", p50: "23:58", p75: "21:04", p90: "19:45", pace: "6:14" },
  { division: "Open 500", gender: "Women", athletes: 120, p25: "28:49", p50: "25:22", p75: "22:26", p90: "20:17", pace: "6:37" },
  { division: "Open 800", gender: "Men", athletes: 189, p25: "36:08", p50: "32:21", p75: "28:33", p90: "26:20", pace: "5:10" },
  { division: "Open 800", gender: "Women", athletes: 108, p25: "38:38", p50: "33:59", p75: "30:30", p90: "27:38", pace: "5:27" },
  { division: "Doubles 500", gender: "Men", athletes: 42, p25: "24:49", p50: "22:38", p75: "19:33", p90: "16:45", pace: "5:28" },
  { division: "Doubles 500", gender: "Women", athletes: 166, p25: "29:32", p50: "26:17", p75: "23:38", p90: "21:23", pace: "6:56" },
  { division: "Doubles 500", gender: "Mixed", athletes: 112, p25: "26:57", p50: "23:47", p75: "21:34", p90: "19:46", pace: "6:17" },
  { division: "Doubles 800", gender: "Men", athletes: 92, p25: "34:11", p50: "31:39", p75: "28:46", p90: "27:04", pace: "5:01" },
  { division: "Doubles 800", gender: "Women", athletes: 105, p25: "39:22", p50: "35:30", p75: "32:48", p90: "29:57", pace: "5:42" },
  { division: "Doubles 800", gender: "Mixed", athletes: 120, p25: "37:34", p50: "34:26", p75: "30:08", p90: "26:35", pace: "5:18" },
  { division: "Pro Doubles", gender: "Men", athletes: 11, p25: "29:19", p50: "25:38", p75: "24:43", p90: "24:43", pace: "4:08" },
  { division: "Pro Doubles", gender: "Women", athletes: 13, p25: "32:49", p50: "29:42", p75: "27:59", p90: "26:35", pace: "4:45" },
  { division: "Pro", gender: "Men", athletes: 13, p25: "28:53", p50: "28:21", p75: "27:40", p90: "24:54", pace: "4:26" },
  { division: "Pro", gender: "Women", athletes: 21, p25: "36:10", p50: "33:18", p75: "30:55", p90: "28:52", pace: "5:20" },
  { division: "Relay", gender: "Mixed", athletes: 9, p25: "30:42", p50: "29:20", p75: "25:26", p90: "23:46", pace: "4:28" },
];

// ---- TRY Zone percentiles ----
const TRYZONE_ROWS: { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string }[] = [
  { division: "Open 500", gender: "Men", athletes: 77, p25: "7:25", p50: "5:47", p75: "4:45", p90: "4:17" },
  { division: "Open 500", gender: "Women", athletes: 120, p25: "8:15", p50: "6:32", p75: "5:06", p90: "4:19" },
  { division: "Open 800", gender: "Men", athletes: 189, p25: "6:14", p50: "5:09", p75: "4:01", p90: "3:29" },
  { division: "Open 800", gender: "Women", athletes: 108, p25: "6:18", p50: "4:53", p75: "4:03", p90: "3:42" },
  { division: "Doubles 500", gender: "Men", athletes: 42, p25: "6:39", p50: "5:23", p75: "4:22", p90: "3:32" },
  { division: "Doubles 500", gender: "Women", athletes: 166, p25: "7:18", p50: "5:58", p75: "5:05", p90: "4:20" },
  { division: "Doubles 500", gender: "Mixed", athletes: 112, p25: "7:04", p50: "5:56", p75: "4:57", p90: "4:09" },
  { division: "Doubles 800", gender: "Men", athletes: 92, p25: "5:25", p50: "4:23", p75: "3:54", p90: "3:33" },
  { division: "Doubles 800", gender: "Women", athletes: 105, p25: "5:53", p50: "4:56", p75: "4:15", p90: "3:42" },
  { division: "Doubles 800", gender: "Mixed", athletes: 120, p25: "5:35", p50: "4:52", p75: "3:58", p90: "3:28" },
  { division: "Pro Doubles", gender: "Men", athletes: 11, p25: "3:58", p50: "3:23", p75: "3:18", p90: "3:11" },
  { division: "Pro Doubles", gender: "Women", athletes: 13, p25: "4:32", p50: "4:14", p75: "3:56", p90: "3:25" },
  { division: "Pro", gender: "Men", athletes: 13, p25: "3:55", p50: "3:47", p75: "3:35", p90: "3:22" },
  { division: "Pro", gender: "Women", athletes: 21, p25: "6:38", p50: "5:17", p75: "4:19", p90: "3:53" },
  { division: "Relay", gender: "Mixed", athletes: 9, p25: "4:21", p50: "4:01", p75: "3:19", p90: "3:14" },
];

// ---- Stations (median seconds per division x gender; splits under half the group median dropped as timing errors) ----
const STATIONS: StationsByDivision[] = [
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 277 }, { gender: "Women", sec: 318 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 123 }, { gender: "Women", sec: 122 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 261 }, { gender: "Women", sec: 237 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 176 }, { gender: "Women", sec: 118 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 278 }, { gender: "Women", sec: 306 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 314 }, { gender: "Women", sec: 345 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 326 }, { gender: "Women", sec: 327 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 334 }, { gender: "Women", sec: 437 }] },
    ],
  },
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 265 }, { gender: "Women", sec: 306 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 107 }, { gender: "Women", sec: 111 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 229 }, { gender: "Women", sec: 208 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 152 }, { gender: "Women", sec: 98 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 246 }, { gender: "Women", sec: 255 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 289 }, { gender: "Women", sec: 327 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 302 }, { gender: "Women", sec: 258 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 302 }, { gender: "Women", sec: 333 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 245 }, { gender: "Women", sec: 287 }, { gender: "Mixed", sec: 261 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 100 }, { gender: "Women", sec: 112 }, { gender: "Mixed", sec: 106 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 164 }, { gender: "Women", sec: 170 }, { gender: "Mixed", sec: 186 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 96 }, { gender: "Women", sec: 82 }, { gender: "Mixed", sec: 106 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 170 }, { gender: "Women", sec: 222 }, { gender: "Mixed", sec: 216 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 276 }, { gender: "Women", sec: 321 }, { gender: "Mixed", sec: 298 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 227 }, { gender: "Women", sec: 214 }, { gender: "Mixed", sec: 228 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 208 }, { gender: "Women", sec: 254 }, { gender: "Mixed", sec: 217 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 235 }, { gender: "Women", sec: 276 }, { gender: "Mixed", sec: 250 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 91 }, { gender: "Women", sec: 99 }, { gender: "Mixed", sec: 101 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 154 }, { gender: "Women", sec: 157 }, { gender: "Mixed", sec: 170 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 91 }, { gender: "Women", sec: 76 }, { gender: "Mixed", sec: 102 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 156 }, { gender: "Women", sec: 187 }, { gender: "Mixed", sec: 198 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 263 }, { gender: "Women", sec: 301 }, { gender: "Mixed", sec: 281 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 185 }, { gender: "Women", sec: 192 }, { gender: "Mixed", sec: 210 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 163 }, { gender: "Women", sec: 236 }, { gender: "Mixed", sec: 192 }] },
    ],
  },
  {
    division: "Pro Doubles",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 222 }, { gender: "Women", sec: 253 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 94 }, { gender: "Women", sec: 96 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 153 }, { gender: "Women", sec: 169 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 110 }, { gender: "Women", sec: 84 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 193 }, { gender: "Women", sec: 193 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 250 }, { gender: "Women", sec: 278 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 179 }, { gender: "Women", sec: 173 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 120 }, { gender: "Women", sec: 140 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 295 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 96 }, { gender: "Women", sec: 128 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 207 }, { gender: "Women", sec: 311 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 178 }, { gender: "Women", sec: 140 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 272 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 267 }, { gender: "Women", sec: 310 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 261 }, { gender: "Women", sec: 293 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 186 }, { gender: "Women", sec: 281 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Mixed", sec: 297 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Mixed", sec: 108 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Mixed", sec: 159 }] },
      { station: "Sled Push", rows: [{ gender: "Mixed", sec: 123 }] },
      { station: "Sled Pull", rows: [{ gender: "Mixed", sec: 252 }] },
      { station: "Rowing", rows: [{ gender: "Mixed", sec: 285 }] },
      { station: "Lunges", rows: [{ gender: "Mixed", sec: 232 }] },
      { station: "Burpees", rows: [{ gender: "Mixed", sec: 201 }] },
    ],
  },
];

// ---- Station records (splits under 60% of their division x gender median excluded as timing errors) ----
const STATION_RECORDS: { station: string; time: string; who: string; division: string }[] = [
  { station: "SkiErg", time: "2:31", who: "T. Mockler / P. O'Connor", division: "Doubles 500 Men" },
  { station: "KB Farmers Carry", time: "1:10", who: "B. Johnson / H. Brown", division: "Doubles 500 Men" },
  { station: "Ramfit Thrusters", time: "1:45", who: "N. South-Law, L. Millbrow, D. Course, B. Legarda", division: "Relay Mixed" },
  { station: "Sled Push", time: "0:51", who: "C. Slater / B. Geddis", division: "Doubles 800 Women" },
  { station: "Sled Pull", time: "1:39", who: "V. Whitelock / C. Freeman; W. Denby / A. Scott", division: "Doubles 800 Men" },
  { station: "Rowing", time: "3:20", who: "S. Troup / T. Hood", division: "Pro Doubles Women" },
  { station: "Lunges", time: "2:02", who: "E. Carmody / G. Fitzgerald; Kennedy relay team", division: "Doubles 800 Women; Relay Men" },
  { station: "Burpees", time: "1:32", who: "H. Warren / M. Dowling", division: "Pro Doubles Men" },
];

function TimeTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">Entries</th>
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
      <p className="border-t border-tryka-navy-light px-3 py-2 text-xs text-slate-500">
        Pro, Pro Doubles and Relay groups have 9–21 entries, so their 95th and 99th columns are the
        same single result: the group winner.
      </p>
    </div>
  );
}

export default function LondonRace5Report() {
  return (
    <div className="space-y-10">
      {/* ---- Key Insights ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key Insights
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Bradley Johnson and Harry Brown won Doubles 500 in <span className="tabular-nums">36:18</span>,
            the fastest finish of the season and nearly two minutes quicker than the winning time at Dublin Summer Race 4,{" "}
            <span className="tabular-nums">38:10</span>.
          </li>
          <li>
            All six athletes on the Doubles 500 men&apos;s podium had raced Open 800 about two and a half
            hours earlier. Harry Brown finished fourth there in <span className="tabular-nums">50:30</span>.
          </li>
          <li>
            Carly Reynolds won Mixed Doubles 800 with Kyle Turner in the morning, then won Pro women that
            afternoon in <span className="tabular-nums">55:29</span>. Turner came back in the evening and
            finished second in Pro men.
          </li>
          <li>
            In Open 800 the median man (<span className="tabular-nums">1:10:34</span>) and the median
            woman (<span className="tabular-nums">1:10:48</span>) finished just 14 seconds apart. At
            Dublin Summer Race 4 the gap was four minutes.
          </li>
          <li>
            Pro women ran faster than Open 800 women (<span className="tabular-nums">5:20/km</span> vs{" "}
            <span className="tabular-nums">5:27/km</span>) but finished three minutes slower at the
            median. Their heavier Thrusters alone cost <span className="tabular-nums">1:43</span>.
          </li>
        </ul>
      </section>

      {/* ---- By the numbers ---- */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Athletes</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">1,902</div>
            <div className="mt-1 text-xs text-slate-400">across 1,202 entries</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest finish</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">36:18</div>
            <div className="mt-1 text-xs text-slate-400">B. Johnson / H. Brown, Doubles 500</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Raced twice</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">65</div>
            <div className="mt-1 text-xs text-slate-400">athletes entered two divisions</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest Pro</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">52:21</div>
            <div className="mt-1 text-xs text-slate-400">Jack Waymark, Pro Men</div>
          </div>
        </div>
      </section>

      {/* ---- Race overview ---- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Race overview
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          London Race 5 was about a quarter the size of Dublin Summer Race 4, but the mix was
          different. The four main divisions were close in size: Doubles 500 and Doubles 800 had{" "}
          <span className="tabular-nums">320</span> and <span className="tabular-nums">317</span> entries,
          and Open 800 was close behind at <span className="tabular-nums">297</span>. Women made up the
          largest group again (<span className="tabular-nums">535</span> entries, against{" "}
          <span className="tabular-nums">426</span> men and <span className="tabular-nums">241</span>{" "}
          mixed teams). Mixed was the biggest category in Doubles 800. Open 800 leaned heavily male
          (<span className="tabular-nums">189</span> men to <span className="tabular-nums">108</span>{" "}
          women), and Open 500 leaned the other way (<span className="tabular-nums">120</span> women to{" "}
          <span className="tabular-nums">77</span> men). The 30–39 and 40–49 bands were again the most
          common.
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
        <p className="mt-2 text-xs text-slate-500">
          Entries per division (a Doubles entry = two athletes; a Relay entry = four). Nine placeholder
          Relay entries with no athlete names are excluded.
        </p>
      </section>

      {/* ---- Division performance ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Division performance
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Overall-time percentiles, CrossFit Open style: read left to right from the slower end of the
          field to the sharp end. The 99th column is the time posted by the fastest 1% of each group;
          the 25th is a bottom-quartile time. Doubles 500 men had the fastest times at every percentile
          from the 75th up, and also the widest spread: <span className="tabular-nums">36:18</span> at
          the top against <span className="tabular-nums">57:13</span> at the 25th. The top five finishes
          of the day were all in Doubles 500, including the Mixed winners Lauren Hindley and Joe
          Langbridge in <span className="tabular-nums">38:31</span>.
        </p>
        <TimeTable rows={PERCENTILE_ROWS} />
      </section>

      {/* ---- Running ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Running performance
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Run totals cover the full running distance (4&nbsp;km for 500 formats, 6.4&nbsp;km for 800
          formats), so compare them within a format. Pace is the fair comparison across divisions. Pro
          Doubles men averaged <span className="tabular-nums">4:08/km</span>, more than half a minute
          per km quicker than the same group at Dublin Summer Race 4. Pro men averaged{" "}
          <span className="tabular-nums">4:26/km</span>. Relay tops the division chart because each leg
          runs only part of the distance.
        </p>
        <div className="mb-6 overflow-x-auto rounded-lg border border-tryka-navy-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2">Gender</th>
                <th className="px-3 py-2 text-right">Entries</th>
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
          Pro Doubles men had the fastest TRY Zone, with a median of{" "}
          <span className="tabular-nums">3:23</span>. Pro men were the most evenly matched group: only{" "}
          <span className="tabular-nums">33</span> seconds separated their 25th and 90th percentiles. Pro
          women were the exception among the elite groups. Their median of{" "}
          <span className="tabular-nums">5:17</span> was slower than Open 800 women&apos;s{" "}
          <span className="tabular-nums">4:53</span>, the same pattern as their overall times.
        </p>
        <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2">Gender</th>
                <th className="px-3 py-2 text-right">Entries</th>
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
          profile. Compare Pro and Open 800 women to see the cost of Pro weights: Pro women took{" "}
          <span className="tabular-nums">5:11</span> on Thrusters against{" "}
          <span className="tabular-nums">3:28</span>, and <span className="tabular-nums">2:20</span> on
          the Sled Push against <span className="tabular-nums">1:38</span>. Doubles crews split the reps
          between two athletes, so compare formats by the shape of the chart, not by raw seconds.
        </p>
        <StationPicker divisions={STATIONS} />

        <h3 className="mb-3 mt-6 text-xs uppercase tracking-wide text-slate-400">Fastest time on each station</h3>
        <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Station</th>
                <th className="px-3 py-2 text-right">Time</th>
                <th className="px-3 py-2">Set by</th>
                <th className="px-3 py-2">Division</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tryka-navy-light">
              {STATION_RECORDS.map((r) => (
                <tr key={r.station} className="hover:bg-tryka-navy-light/50">
                  <td className="whitespace-nowrap px-3 py-2">{r.station}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.time}</td>
                  <td className="px-3 py-2">{r.who}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-400">{r.division}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-tryka-navy-light px-3 py-2 text-xs text-slate-500">
            London Race 5 had a lot of timing-mat errors, especially on the Doubles SkiErg, where some splits
            are under a minute. Splits faster than 60% of their division and gender median are excluded
            here, so a few very fast individual times may be left out too.
          </p>
        </div>
      </section>

      {/* ---- Sprint finish ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Sprint finish
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          The sprint to the line took a median of <span className="tabular-nums">11</span> seconds. Five
          entries shared the fastest time of <span className="tabular-nums">0:07</span>: four Pro Doubles
          crews (Parker / Muntz, Warren / Dowling, O&apos;Byrne / Harty and Lonergan / McCrystal) and
          Junior Raji from Open 500. At the other end, a few entries took more than two minutes to cover
          the last few metres.
        </p>
      </section>

      {/* ---- Key takeaways ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key takeaways
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            London Race 5 was smaller than Dublin Autumn Race 1, Dublin Winter Race 2, Dublin Spring Race 3
            and Dublin Summer Race 4, but just as fast at the top.
            The season&apos;s best finish came from a pair who had already raced 6.4&nbsp;km earlier that day.
          </li>
          <li>
            Many of the strongest athletes raced twice. The Doubles 500 podium, the Pro women&apos;s winner
            and the Pro men&apos;s runner-up all came back for a second division.
          </li>
          <li>
            The Open 800 gender gap nearly disappeared at the median. Women were quicker on Lunges,
            Thrusters and the Sled Push, and were less than two minutes slower on the median run total.
          </li>
          <li>
            Pro is about strength as much as fitness. Pro women out-ran the Open 800 field and still
            finished behind it, because of the extra load on the stations.
          </li>
        </ul>
      </section>
    </div>
  );
}
