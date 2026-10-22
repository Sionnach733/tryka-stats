import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

export const intro =
  "Lisbon Race 6 Grand Finale closed Tryka's first series with its smallest field, 479 entries and 780 athletes, and its fastest finish: a 35:24 Doubles 500 by Portuguese pair Diogo Fonseca and Antonio Vilhena. Portuguese crews won five of the eleven team categories at home, and two athletes who had raced Pro at every round of the series, Clara Hogan and Robert Ronan, finally took the Pro titles.";

// ---- Overview ----
const ENTRIES_PER_DIVISION: { label: string; value: number }[] = [
  { label: "Doubles 500", value: 148 },
  { label: "Open 800", value: 98 },
  { label: "Doubles 800", value: 95 },
  { label: "Open 500", value: 86 },
  { label: "Pro Doubles", value: 22 },
  { label: "Pro", value: 18 },
  { label: "Relay", value: 12 },
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
  { division: "Open 500", gender: "Men", athletes: 40, p25: "1:08:04", p50: "1:00:17", p75: "51:39", p90: "49:15", p95: "46:54", p99: "45:19" },
  { division: "Open 500", gender: "Women", athletes: 46, p25: "1:15:31", p50: "1:08:37", p75: "59:56", p90: "56:10", p95: "54:36", p99: "49:13" },
  { division: "Open 800", gender: "Men", athletes: 61, p25: "1:14:08", p50: "1:07:28", p75: "1:03:18", p90: "58:05", p95: "54:50", p99: "51:21" },
  { division: "Open 800", gender: "Women", athletes: 37, p25: "1:15:03", p50: "1:10:00", p75: "1:06:17", p90: "1:03:02", p95: "57:42", p99: "54:10" },
  { division: "Doubles 500", gender: "Men", athletes: 21, p25: "53:39", p50: "48:49", p75: "44:21", p90: "37:53", p95: "37:47", p99: "35:24" },
  { division: "Doubles 500", gender: "Women", athletes: 98, p25: "1:03:52", p50: "58:36", p75: "53:06", p90: "50:30", p95: "47:32", p99: "43:20" },
  { division: "Doubles 500", gender: "Mixed", athletes: 29, p25: "59:19", p50: "55:40", p75: "50:52", p90: "43:54", p95: "43:00", p99: "42:53" },
  { division: "Doubles 800", gender: "Men", athletes: 18, p25: "1:05:42", p50: "58:34", p75: "55:23", p90: "54:18", p95: "51:49", p99: "51:49" },
  { division: "Doubles 800", gender: "Women", athletes: 42, p25: "1:13:03", p50: "1:06:58", p75: "1:02:37", p90: "58:38", p95: "55:55", p99: "54:11" },
  { division: "Doubles 800", gender: "Mixed", athletes: 35, p25: "1:08:27", p50: "1:03:37", p75: "57:42", p90: "53:07", p95: "50:17", p99: "44:55" },
  { division: "Pro Doubles", gender: "Men", athletes: 13, p25: "54:43", p50: "51:15", p75: "46:58", p90: "44:58", p95: "44:25", p99: "44:25" },
  { division: "Pro Doubles", gender: "Women", athletes: 9, p25: "1:04:22", p50: "57:22", p75: "55:44", p90: "50:38", p95: "50:38", p99: "50:38" },
  { division: "Pro", gender: "Men", athletes: 12, p25: "1:14:26", p50: "1:04:49", p75: "59:36", p90: "57:51", p95: "57:28", p99: "57:28" },
  { division: "Pro", gender: "Women", athletes: 6, p25: "1:13:35", p50: "1:10:50", p75: "1:05:35", p90: "1:01:09", p95: "1:01:09", p99: "1:01:09" },
  { division: "Relay", gender: "Men", athletes: 5, p25: "49:53", p50: "49:38", p75: "49:20", p90: "46:52", p95: "46:52", p99: "46:52" },
  { division: "Relay", gender: "Women", athletes: 5, p25: "1:04:28", p50: "57:47", p75: "52:07", p90: "48:38", p95: "48:38", p99: "48:38" },
];

// ---- Running: pace per km by division (all entries, run total / distance) ----
const PACE_ROWS: { label: string; paceSec: number; pace: string }[] = [
  { label: "Relay", paceSec: 254, pace: "4:14" },
  { label: "Pro Doubles", paceSec: 271, pace: "4:31" },
  { label: "Pro", paceSec: 285, pace: "4:45" },
  { label: "Open 800", paceSec: 311, pace: "5:11" },
  { label: "Doubles 800", paceSec: 326, pace: "5:26" },
  { label: "Open 500", paceSec: 361, pace: "6:01" },
  { label: "Doubles 500", paceSec: 366, pace: "6:06" },
];
const maxPace = Math.max(...PACE_ROWS.map((p) => p.paceSec));

type RunRow = { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string; pace: string };
const RUN_ROWS: RunRow[] = [
  { division: "Open 500", gender: "Men", athletes: 40, p25: "22:53", p50: "21:40", p75: "18:49", p90: "18:11", pace: "5:25" },
  { division: "Open 500", gender: "Women", athletes: 46, p25: "26:43", p50: "24:22", p75: "22:25", p90: "21:10", pace: "6:32" },
  { division: "Open 800", gender: "Men", athletes: 61, p25: "34:36", p50: "31:57", p75: "29:34", p90: "28:00", pace: "5:06" },
  { division: "Open 800", gender: "Women", athletes: 37, p25: "34:55", p50: "33:53", p75: "32:01", p90: "30:50", pace: "5:20" },
  { division: "Doubles 500", gender: "Men", athletes: 21, p25: "22:00", p50: "20:54", p75: "19:03", p90: "16:47", pace: "5:15" },
  { division: "Doubles 500", gender: "Women", athletes: 98, p25: "27:20", p50: "24:45", p75: "22:27", p90: "20:54", pace: "6:22" },
  { division: "Doubles 500", gender: "Mixed", athletes: 29, p25: "25:01", p50: "23:03", p75: "21:31", p90: "17:45", pace: "5:48" },
  { division: "Doubles 800", gender: "Men", athletes: 18, p25: "35:03", p50: "31:49", p75: "29:40", p90: "29:09", pace: "5:06" },
  { division: "Doubles 800", gender: "Women", athletes: 42, p25: "38:14", p50: "36:09", p75: "33:23", p90: "30:47", pace: "5:40" },
  { division: "Doubles 800", gender: "Mixed", athletes: 35, p25: "37:08", p50: "33:39", p75: "30:54", p90: "28:15", pace: "5:18" },
  { division: "Pro Doubles", gender: "Men", athletes: 13, p25: "28:04", p50: "25:06", p75: "23:57", p90: "23:22", pace: "4:03" },
  { division: "Pro Doubles", gender: "Women", athletes: 9, p25: "32:55", p50: "29:18", p75: "28:25", p90: "26:00", pace: "5:10" },
  { division: "Pro", gender: "Men", athletes: 12, p25: "32:43", p50: "28:29", p75: "27:46", p90: "27:28", pace: "4:38" },
  { division: "Pro", gender: "Women", athletes: 6, p25: "32:54", p50: "32:37", p75: "29:47", p90: "28:34", pace: "4:58" },
  { division: "Relay", gender: "Men", athletes: 5, p25: "24:25", p50: "22:31", p75: "22:30", p90: "22:08", pace: "3:38" },
  { division: "Relay", gender: "Women", athletes: 5, p25: "31:03", p50: "26:01", p75: "25:17", p90: "24:30", pace: "4:26" },
];

// ---- TRY Zone percentiles ----
const TRYZONE_ROWS: { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string }[] = [
  { division: "Open 500", gender: "Men", athletes: 40, p25: "6:27", p50: "5:22", p75: "4:17", p90: "4:03" },
  { division: "Open 500", gender: "Women", athletes: 46, p25: "7:08", p50: "6:05", p75: "5:23", p90: "4:35" },
  { division: "Open 800", gender: "Men", athletes: 61, p25: "5:55", p50: "5:13", p75: "4:36", p90: "3:57" },
  { division: "Open 800", gender: "Women", athletes: 37, p25: "5:56", p50: "4:52", p75: "4:26", p90: "4:03" },
  { division: "Doubles 500", gender: "Men", athletes: 21, p25: "5:47", p50: "5:01", p75: "4:16", p90: "3:23" },
  { division: "Doubles 500", gender: "Women", athletes: 98, p25: "6:48", p50: "5:55", p75: "5:07", p90: "4:35" },
  { division: "Doubles 500", gender: "Mixed", athletes: 29, p25: "6:01", p50: "5:28", p75: "4:52", p90: "3:59" },
  { division: "Doubles 800", gender: "Men", athletes: 18, p25: "5:07", p50: "4:26", p75: "4:05", p90: "3:51" },
  { division: "Doubles 800", gender: "Women", athletes: 42, p25: "5:36", p50: "5:01", p75: "4:40", p90: "4:15" },
  { division: "Doubles 800", gender: "Mixed", athletes: 35, p25: "5:27", p50: "4:39", p75: "4:00", p90: "3:47" },
  { division: "Pro Doubles", gender: "Men", athletes: 13, p25: "4:01", p50: "3:38", p75: "3:15", p90: "3:05" },
  { division: "Pro Doubles", gender: "Women", athletes: 9, p25: "4:41", p50: "4:02", p75: "3:52", p90: "3:28" },
  { division: "Pro", gender: "Men", athletes: 12, p25: "5:01", p50: "4:28", p75: "4:03", p90: "3:45" },
  { division: "Pro", gender: "Women", athletes: 6, p25: "5:15", p50: "5:11", p75: "4:33", p90: "4:28" },
  { division: "Relay", gender: "Men", athletes: 5, p25: "3:25", p50: "3:24", p75: "3:20", p90: "3:06" },
  { division: "Relay", gender: "Women", athletes: 5, p25: "4:27", p50: "4:05", p75: "3:31", p90: "3:24" },
];

// ---- Stations (median seconds per division x gender; splits under half the group median dropped as timing errors) ----
const STATIONS: StationsByDivision[] = [
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 263 }, { gender: "Women", sec: 311 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 120 }, { gender: "Women", sec: 124 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 229 }, { gender: "Women", sec: 209 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 179 }, { gender: "Women", sec: 137 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 260 }, { gender: "Women", sec: 308 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 305 }, { gender: "Women", sec: 342 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 301 }, { gender: "Women", sec: 303 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 318 }, { gender: "Women", sec: 391 }] },
    ],
  },
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 260 }, { gender: "Women", sec: 300 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 115 }, { gender: "Women", sec: 110 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 207 }, { gender: "Women", sec: 193 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 163 }, { gender: "Women", sec: 127 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 237 }, { gender: "Women", sec: 259 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 283 }, { gender: "Women", sec: 318 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 272 }, { gender: "Women", sec: 261 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 267 }, { gender: "Women", sec: 306 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 242 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 251 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 91 }, { gender: "Women", sec: 112 }, { gender: "Mixed", sec: 110 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 152 }, { gender: "Women", sec: 165 }, { gender: "Mixed", sec: 172 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 82 }, { gender: "Women", sec: 87 }, { gender: "Mixed", sec: 107 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 152 }, { gender: "Women", sec: 232 }, { gender: "Mixed", sec: 218 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 283 }, { gender: "Women", sec: 313 }, { gender: "Mixed", sec: 282 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 203 }, { gender: "Women", sec: 217 }, { gender: "Mixed", sec: 220 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 179 }, { gender: "Women", sec: 243 }, { gender: "Mixed", sec: 192 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 231 }, { gender: "Women", sec: 282 }, { gender: "Mixed", sec: 241 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 99 }, { gender: "Women", sec: 103 }, { gender: "Mixed", sec: 103 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 148 }, { gender: "Women", sec: 157 }, { gender: "Mixed", sec: 155 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 95 }, { gender: "Women", sec: 78 }, { gender: "Mixed", sec: 98 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 157 }, { gender: "Women", sec: 216 }, { gender: "Mixed", sec: 188 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 267 }, { gender: "Women", sec: 308 }, { gender: "Mixed", sec: 264 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 175 }, { gender: "Women", sec: 198 }, { gender: "Mixed", sec: 197 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 164 }, { gender: "Women", sec: 232 }, { gender: "Mixed", sec: 175 }] },
    ],
  },
  {
    division: "Pro Doubles",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 215 }, { gender: "Women", sec: 257 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 97 }, { gender: "Women", sec: 110 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 137 }, { gender: "Women", sec: 160 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 113 }, { gender: "Women", sec: 123 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 205 }, { gender: "Women", sec: 223 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 238 }, { gender: "Women", sec: 278 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 185 }, { gender: "Women", sec: 204 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 118 }, { gender: "Women", sec: 170 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 258 }, { gender: "Women", sec: 288 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 124 }, { gender: "Women", sec: 135 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 213 }, { gender: "Women", sec: 243 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 226 }, { gender: "Women", sec: 194 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 282 }, { gender: "Women", sec: 306 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 273 }, { gender: "Women", sec: 303 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 291 }, { gender: "Women", sec: 248 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 207 }, { gender: "Women", sec: 236 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 238 }, { gender: "Women", sec: 287 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 111 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 146 }, { gender: "Women", sec: 142 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 123 }, { gender: "Women", sec: 112 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 168 }, { gender: "Women", sec: 260 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 248 }, { gender: "Women", sec: 288 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 204 }, { gender: "Women", sec: 212 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 155 }, { gender: "Women", sec: 208 }] },
    ],
  },
];

// ---- Station records (splits under 60% of their division x gender median excluded as timing errors) ----
const STATION_RECORDS: { station: string; time: string; who: string; division: string }[] = [
  { station: "SkiErg", time: "3:21", who: "T. Joaninho / D. Carvalho", division: "Pro Doubles Men" },
  { station: "KB Farmers Carry", time: "1:17", who: "A. Seery; C. Marron / C. McEnaney; D. Hawkins / N. Rice", division: "Open 800 Men; Doubles 500 Men; Doubles 800 Men" },
  { station: "Ramfit Thrusters", time: "1:47", who: "A. Syme, D. Hogan, A. Dowling, N. Howlin", division: "Relay Women" },
  { station: "Sled Push", time: "0:56", who: "A. Niall / C. Holfeld", division: "Doubles 800 Women" },
  { station: "Sled Pull", time: "1:51", who: "B. Lee / T. Hogan", division: "Doubles 500 Men" },
  { station: "Rowing", time: "3:35", who: "B. Lee / T. Hogan", division: "Doubles 500 Men" },
  { station: "Lunges", time: "2:06", who: "B. Branco / R. Fonseca", division: "Pro Doubles Men" },
  { station: "Burpees", time: "1:26", who: "P. Syme / M. Dowling", division: "Pro Doubles Men" },
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
        Pro, Pro Doubles and Relay groups have 5–13 entries, so their 95th and 99th columns are the
        same single result: the group winner. Mixed Relay had only two entries and is left out.
      </p>
    </div>
  );
}

export default function LisbonRace6GrandFinaleReport() {
  return (
    <div className="space-y-10">
      {/* ---- Key Insights ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key Insights
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Diogo Fonseca and Antonio Vilhena won Doubles 500 in <span className="tabular-nums">35:24</span>,
            the fastest finish of the series and 54 seconds quicker than the previous best,{" "}
            <span className="tabular-nums">36:18</span> at London Race 5. It was their first Tryka race.
          </li>
          <li>
            Clara Hogan and Robert Ronan raced Pro at all six rounds and won it at the last one. Hogan
            had finished second at Dublin Summer Race 4 and London Race 5; Ronan&apos;s best before
            Lisbon was third in London.
          </li>
          <li>
            Portuguese crews won five of the eleven team categories: Doubles 500 Men, Doubles 800 Men,
            Doubles 800 Mixed, Relay Men and Relay Mixed. Rosa Cunha and Tiago Lousa&apos;s{" "}
            <span className="tabular-nums">44:55</span> in Mixed Doubles 800 was the best of the series
            in that category by more than a minute.
          </li>
          <li>
            Anna Syme and Dena Hogan won Pro Doubles Women in <span className="tabular-nums">50:38</span>,
            then joined Aoife Dowling and Noeleen Howlin to win the Women&apos;s Relay in{" "}
            <span className="tabular-nums">48:38</span>, nearly four minutes faster than any women&apos;s
            relay earlier in the series.
          </li>
          <li>
            The winning Pro times were the slowest of the series: <span className="tabular-nums">57:28</span>{" "}
            for the men and <span className="tabular-nums">1:01:09</span> for the women. At every earlier
            round the Pro men&apos;s winner finished under 53 minutes.
          </li>
        </ul>
      </section>

      {/* ---- By the numbers ---- */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Athletes</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">780</div>
            <div className="mt-1 text-xs text-slate-400">across 479 entries</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest finish</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">35:24</div>
            <div className="mt-1 text-xs text-slate-400">D. Fonseca / A. Vilhena, Doubles 500</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">New faces</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">315</div>
            <div className="mt-1 text-xs text-slate-400">athletes with no earlier Tryka result</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Ever-presents</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">21</div>
            <div className="mt-1 text-xs text-slate-400">athletes raced all six rounds</div>
          </div>
        </div>
      </section>

      {/* ---- Race overview ---- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Race overview
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          The Grand Finale was the smallest race of the series, about 40% the size of London Race 5.
          Of the <span className="tabular-nums">742</span> different athletes,{" "}
          <span className="tabular-nums">315</span> had no result at any earlier round. Almost all of
          the Portuguese athletes were new: <span className="tabular-nums">115</span> of the{" "}
          <span className="tabular-nums">116</span> on team entries. Doubles 500 was the biggest
          division by a distance (<span className="tabular-nums">148</span> entries), and two-thirds of
          it was women&apos;s pairs. Women made up the largest group overall again (
          <span className="tabular-nums">243</span> entries, against{" "}
          <span className="tabular-nums">170</span> men and <span className="tabular-nums">66</span>{" "}
          mixed teams). Open 800 leaned male (<span className="tabular-nums">61</span> men to{" "}
          <span className="tabular-nums">37</span> women), while Open 500 was close to even. The 40–49
          bands were the most common, followed by 30–39. <span className="tabular-nums">37</span>{" "}
          athletes raced two divisions, and Miguel Carvalho raced three: third in Open 800, then Pro
          Doubles and Mixed Doubles 500.
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
          Entries per division (a Doubles entry = two athletes; a Relay entry = four). Nationality is
          only recorded for team entries, so the Portuguese figures above cover Doubles and Relay
          athletes only.
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
          the 25th is a bottom-quartile time. The ten fastest finishes of the day were all in Doubles
          500, and the top three were men&apos;s pairs: Fonseca / Vilhena, then Gonçalo Fraga and
          Guilherme Neves in <span className="tabular-nums">37:47</span>, then Brian Lee and Tom Hogan
          in <span className="tabular-nums">37:53</span>. Doubles 500 men also had the quickest median
          of any group, <span className="tabular-nums">48:49</span>, four minutes faster than in
          London. The Open 800 gender gap opened up again: the median man finished{" "}
          <span className="tabular-nums">2:32</span> ahead of the median woman, against 14 seconds in
          London.
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
          Doubles men averaged <span className="tabular-nums">4:03/km</span>, the fastest of any pair
          or solo group this series. Pro women again ran faster than Open 800 women (
          <span className="tabular-nums">4:58/km</span> against <span className="tabular-nums">5:20/km</span>)
          and still finished behind them at the median. Relay tops the division chart because each leg
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
          Pro Doubles men had the fastest TRY Zone of any pair or solo group, with a median of{" "}
          <span className="tabular-nums">3:38</span>. Relay men were quicker still at{" "}
          <span className="tabular-nums">3:24</span>, with fresh legs on each leg. For the second race
          running, Open 800 women beat Open 800 men here: a median of{" "}
          <span className="tabular-nums">4:52</span> against <span className="tabular-nums">5:13</span>,
          even though the men were faster overall.
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
          profile. Pro men&apos;s slow winning times show up on the sleds: their median Sled Push took{" "}
          <span className="tabular-nums">3:46</span>, slower than every other group including Pro
          women (<span className="tabular-nums">3:14</span>), and their Sled Pull took{" "}
          <span className="tabular-nums">4:42</span>. Doubles crews split the reps between two
          athletes, so compare formats by the shape of the chart, not by raw seconds.
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
            Splits faster than 60% of their division and gender median are excluded as timing-mat
            errors. That removed 15 Burpees splits and a handful on the other stations. Brian Lee and
            Tom Hogan set two station records and still finished third in Doubles 500.
          </p>
        </div>
      </section>

      {/* ---- Sprint finish ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Sprint finish
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          The sprint to the line took a median of <span className="tabular-nums">9</span> seconds, two
          quicker than in London. Five entries shared the fastest time of{" "}
          <span className="tabular-nums">0:06</span>: Patrick Syme and Michael Dowling from Pro
          Doubles, Aaron Seery and John Nulty from Open 800, and the Doubles 800 crews Ronan Mahon /
          Pol O&apos;Huaithne and Denise Maxwell / Daniel Raburski. Nobody took longer than{" "}
          <span className="tabular-nums">24</span> seconds.
        </p>
      </section>

      {/* ---- Key takeaways ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key takeaways
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            The smallest field of the series produced its fastest finish. Three of the series&apos;
            category bests fell in Lisbon: Doubles 500 Men, Doubles 800 Mixed and Relay Women.
          </li>
          <li>
            Lisbon brought a new crowd. More than four in ten athletes were racing Tryka for the first
            time, and the local Portuguese crews took five team titles.
          </li>
          <li>
            Consistency paid off. Clara Hogan and Robert Ronan turned up for all six rounds of Pro and
            took the titles in the final one.
          </li>
          <li>
            The Pro field was thin and slow: twelve men and six women, with the winners several minutes
            outside the times that won in Dublin and London.
          </li>
        </ul>
      </section>
    </div>
  );
}
