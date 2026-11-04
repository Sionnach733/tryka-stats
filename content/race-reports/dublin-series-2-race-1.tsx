import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

export const intro =
  "Tryka's second series opened in Dublin with 7,801 athletes across 4,530 entries, twice the size of the first series' opener and the second-biggest Tryka race yet. About half the field was new to Tryka. Two division bests from Series 1 fell: Josh Mckenna won Open 500 in 40:53, fifth fastest of the whole day, and Mike and Mark Carmody took Doubles 800 in 43:51.";

// ---- Overview ----
const ENTRIES_PER_DIVISION: { label: string; value: number }[] = [
  { label: "Doubles 500", value: 1934 },
  { label: "Doubles 800", value: 1008 },
  { label: "Open 500", value: 719 },
  { label: "Open 800", value: 690 },
  { label: "Relay", value: 97 },
  { label: "Pro", value: 44 },
  { label: "Pro Doubles", value: 38 },
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
type RunRow = { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string; pace: string };

const PERCENTILE_ROWS: Row[] = [
  { division: "Open 500", gender: "Men", athletes: 289, p25: "1:14:12", p50: "1:04:52", p75: "56:44", p90: "50:21", p95: "47:47", p99: "44:58" },
  { division: "Open 500", gender: "Women", athletes: 430, p25: "1:17:58", p50: "1:08:07", p75: "1:01:31", p90: "57:12", p95: "54:25", p99: "50:38" },
  { division: "Open 800", gender: "Men", athletes: 466, p25: "1:17:41", p50: "1:09:54", p75: "1:03:08", p90: "58:09", p95: "55:15", p99: "51:47" },
  { division: "Open 800", gender: "Women", athletes: 224, p25: "1:24:17", p50: "1:16:07", p75: "1:09:57", p90: "1:04:04", p95: "1:01:38", p99: "58:19" },
  { division: "Doubles 500", gender: "Men", athletes: 318, p25: "1:01:52", p50: "55:21", p75: "50:23", p90: "45:52", p95: "43:21", p99: "39:47" },
  { division: "Doubles 500", gender: "Women", athletes: 1181, p25: "1:08:56", p50: "1:03:02", p75: "57:52", p90: "54:13", p95: "51:17", p99: "47:14" },
  { division: "Doubles 500", gender: "Mixed", athletes: 435, p25: "1:06:17", p50: "59:43", p75: "54:56", p90: "50:13", p95: "47:26", p99: "43:38" },
  { division: "Doubles 800", gender: "Men", athletes: 377, p25: "1:06:42", p50: "1:00:44", p75: "56:18", p90: "52:04", p95: "49:32", p99: "44:44" },
  { division: "Doubles 800", gender: "Women", athletes: 399, p25: "1:15:47", p50: "1:10:44", p75: "1:05:22", p90: "1:00:25", p95: "57:23", p99: "54:36" },
  { division: "Doubles 800", gender: "Mixed", athletes: 232, p25: "1:11:20", p50: "1:06:15", p75: "1:01:10", p90: "57:04", p95: "54:08", p99: "49:25" },
  { division: "Pro Doubles", gender: "Men", athletes: 24, p25: "1:03:02", p50: "58:21", p75: "50:20", p90: "48:45", p95: "48:22", p99: "45:36" },
  { division: "Pro Doubles", gender: "Women", athletes: 14, p25: "1:10:48", p50: "1:08:57", p75: "58:25", p90: "52:59", p95: "52:42", p99: "52:42" },
  { division: "Pro", gender: "Men", athletes: 30, p25: "1:10:10", p50: "1:05:17", p75: "59:52", p90: "56:25", p95: "53:35", p99: "51:46" },
  { division: "Pro", gender: "Women", athletes: 14, p25: "1:30:58", p50: "1:15:18", p75: "1:00:10", p90: "57:31", p95: "55:27", p99: "55:27" },
  { division: "Relay", gender: "Men", athletes: 21, p25: "1:14:55", p50: "1:00:40", p75: "50:49", p90: "48:46", p95: "48:15", p99: "47:53" },
  { division: "Relay", gender: "Women", athletes: 50, p25: "1:21:39", p50: "1:13:12", p75: "1:04:13", p90: "55:38", p95: "54:25", p99: "51:00" },
  { division: "Relay", gender: "Mixed", athletes: 26, p25: "1:21:31", p50: "1:15:17", p75: "1:06:45", p90: "1:03:22", p95: "53:49", p99: "52:10" },
];

const RUN_ROWS: RunRow[] = [
  { division: "Open 500", gender: "Men", athletes: 288, p25: "25:51", p50: "22:52", p75: "20:07", p90: "18:27", pace: "5:50" },
  { division: "Open 500", gender: "Women", athletes: 430, p25: "27:38", p50: "24:19", p75: "22:28", p90: "21:10", pace: "6:30" },
  { division: "Open 800", gender: "Men", athletes: 466, p25: "35:50", p50: "32:39", p75: "29:49", p90: "27:34", pace: "5:13" },
  { division: "Open 800", gender: "Women", athletes: 224, p25: "39:46", p50: "35:43", p75: "33:09", p90: "30:21", pace: "5:42" },
  { division: "Doubles 500", gender: "Men", athletes: 318, p25: "26:32", p50: "23:19", p75: "21:18", p90: "19:20", pace: "6:09" },
  { division: "Doubles 500", gender: "Women", athletes: 1181, p25: "29:19", p50: "26:33", p75: "24:18", p90: "22:38", pace: "6:53" },
  { division: "Doubles 500", gender: "Mixed", athletes: 435, p25: "27:52", p50: "24:54", p75: "22:41", p90: "21:01", pace: "6:27" },
  { division: "Doubles 800", gender: "Men", athletes: 377, p25: "35:18", p50: "32:49", p75: "29:50", p90: "27:46", pace: "5:14" },
  { division: "Doubles 800", gender: "Women", athletes: 399, p25: "40:16", p50: "36:58", p75: "34:32", p90: "32:00", pace: "5:55" },
  { division: "Doubles 800", gender: "Mixed", athletes: 232, p25: "37:18", p50: "34:37", p75: "32:10", p90: "29:30", pace: "5:29" },
  { division: "Pro Doubles", gender: "Men", athletes: 24, p25: "32:32", p50: "29:44", p75: "25:55", p90: "24:22", pace: "4:46" },
  { division: "Pro Doubles", gender: "Women", athletes: 14, p25: "36:02", p50: "33:58", p75: "30:29", p90: "27:31", pace: "5:15" },
  { division: "Pro", gender: "Men", athletes: 30, p25: "33:06", p50: "29:50", p75: "27:07", p90: "25:40", pace: "4:43" },
  { division: "Pro", gender: "Women", athletes: 14, p25: "40:33", p50: "35:01", p75: "28:25", p90: "26:17", pace: "5:30" },
  { division: "Relay", gender: "Men", athletes: 21, p25: "32:15", p50: "29:03", p75: "24:30", p90: "23:57", pace: "4:36" },
  { division: "Relay", gender: "Women", athletes: 49, p25: "38:36", p50: "33:34", p75: "30:10", p90: "26:42", pace: "5:27" },
  { division: "Relay", gender: "Mixed", athletes: 23, p25: "37:31", p50: "32:51", p75: "30:19", p90: "26:37", pace: "5:10" },
];

const TRYZONE_ROWS: { division: string; gender: string; athletes: number; p25: string; p50: string; p75: string; p90: string }[] = [
  { division: "Open 500", gender: "Men", athletes: 277, p25: "7:43", p50: "6:14", p75: "4:58", p90: "3:58" },
  { division: "Open 500", gender: "Women", athletes: 413, p25: "7:27", p50: "6:26", p75: "5:25", p90: "4:44" },
  { division: "Open 800", gender: "Men", athletes: 463, p25: "6:40", p50: "5:24", p75: "4:22", p90: "3:52" },
  { division: "Open 800", gender: "Women", athletes: 220, p25: "6:40", p50: "5:29", p75: "4:46", p90: "4:18" },
  { division: "Doubles 500", gender: "Men", athletes: 311, p25: "7:03", p50: "5:55", p75: "4:56", p90: "4:11" },
  { division: "Doubles 500", gender: "Women", athletes: 1147, p25: "7:27", p50: "6:27", p75: "5:30", p90: "4:51" },
  { division: "Doubles 500", gender: "Mixed", athletes: 431, p25: "7:23", p50: "6:02", p75: "5:12", p90: "4:28" },
  { division: "Doubles 800", gender: "Men", athletes: 369, p25: "5:42", p50: "4:52", p75: "4:05", p90: "3:41" },
  { division: "Doubles 800", gender: "Women", athletes: 392, p25: "6:30", p50: "5:33", p75: "4:48", p90: "4:16" },
  { division: "Doubles 800", gender: "Mixed", athletes: 227, p25: "5:54", p50: "5:04", p75: "4:29", p90: "3:57" },
  { division: "Pro Doubles", gender: "Men", athletes: 24, p25: "4:44", p50: "4:03", p75: "3:21", p90: "3:14" },
  { division: "Pro Doubles", gender: "Women", athletes: 14, p25: "5:51", p50: "5:07", p75: "4:09", p90: "3:48" },
  { division: "Pro", gender: "Men", athletes: 30, p25: "5:38", p50: "4:39", p75: "4:03", p90: "3:39" },
  { division: "Pro", gender: "Women", athletes: 14, p25: "7:43", p50: "5:48", p75: "4:13", p90: "3:40" },
  { division: "Relay", gender: "Men", athletes: 20, p25: "5:34", p50: "4:50", p75: "3:48", p90: "3:34" },
  { division: "Relay", gender: "Women", athletes: 46, p25: "5:55", p50: "5:07", p75: "4:20", p90: "3:53" },
  { division: "Relay", gender: "Mixed", athletes: 19, p25: "5:46", p50: "5:15", p75: "4:47", p90: "3:34" },
];

const PACE_ROWS: { label: string; paceSec: number; pace: string }[] = [
  { label: "Pro Doubles", paceSec: 297, pace: "4:57" },
  { label: "Pro", paceSec: 298, pace: "4:58" },
  { label: "Relay", paceSec: 311, pace: "5:11" },
  { label: "Open 800", paceSec: 322, pace: "5:22" },
  { label: "Doubles 800", paceSec: 334, pace: "5:34" },
  { label: "Open 500", paceSec: 374, pace: "6:14" },
  { label: "Doubles 500", paceSec: 400, pace: "6:40" },
];

const STATIONS: StationsByDivision[] = [
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 271 }, { gender: "Women", sec: 313 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 117 }, { gender: "Women", sec: 119 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 251 }, { gender: "Women", sec: 230 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 199 }, { gender: "Women", sec: 167 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 296 }, { gender: "Women", sec: 327 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 312 }, { gender: "Women", sec: 346 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 301 }, { gender: "Women", sec: 288 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 346 }, { gender: "Women", sec: 421 }] },
    ],
  },
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 263 }, { gender: "Women", sec: 308 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 107 }, { gender: "Women", sec: 113 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 225 }, { gender: "Women", sec: 220 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 171 }, { gender: "Women", sec: 163 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 310 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 293 }, { gender: "Women", sec: 332 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 259 }, { gender: "Women", sec: 257 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 302 }, { gender: "Women", sec: 365 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 247 }, { gender: "Women", sec: 292 }, { gender: "Mixed", sec: 265 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 100 }, { gender: "Women", sec: 113 }, { gender: "Mixed", sec: 111 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 174 }, { gender: "Women", sec: 177 }, { gender: "Mixed", sec: 192 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 106 }, { gender: "Women", sec: 105 }, { gender: "Mixed", sec: 123 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 197 }, { gender: "Women", sec: 256 }, { gender: "Mixed", sec: 236 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 289 }, { gender: "Women", sec: 330 }, { gender: "Mixed", sec: 306 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 201 }, { gender: "Women", sec: 208 }, { gender: "Mixed", sec: 221 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 220 }, { gender: "Women", sec: 288 }, { gender: "Mixed", sec: 243 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 239 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 255 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 93 }, { gender: "Women", sec: 104 }, { gender: "Mixed", sec: 100 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 165 }, { gender: "Women", sec: 169 }, { gender: "Mixed", sec: 178 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 95 }, { gender: "Women", sec: 100 }, { gender: "Mixed", sec: 115 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 167 }, { gender: "Women", sec: 229 }, { gender: "Mixed", sec: 209 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 274 }, { gender: "Women", sec: 312 }, { gender: "Mixed", sec: 291 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 181 }, { gender: "Women", sec: 185 }, { gender: "Mixed", sec: 201 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 182 }, { gender: "Women", sec: 250 }, { gender: "Mixed", sec: 207 }] },
    ],
  },
  {
    division: "Pro Doubles",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 225 }, { gender: "Women", sec: 269 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 97 }, { gender: "Women", sec: 106 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 156 }, { gender: "Women", sec: 182 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 114 }, { gender: "Women", sec: 131 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 203 }, { gender: "Women", sec: 229 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 251 }, { gender: "Women", sec: 304 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 175 }, { gender: "Women", sec: 199 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 165 }, { gender: "Women", sec: 230 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 249 }, { gender: "Women", sec: 290 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 111 }, { gender: "Women", sec: 140 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 235 }, { gender: "Women", sec: 280 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 218 }, { gender: "Women", sec: 218 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 285 }, { gender: "Women", sec: 313 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 275 }, { gender: "Women", sec: 315 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 269 }, { gender: "Women", sec: 276 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 217 }, { gender: "Women", sec: 302 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 271 }, { gender: "Women", sec: 322 }, { gender: "Mixed", sec: 339 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 107 }, { gender: "Women", sec: 117 }, { gender: "Mixed", sec: 121 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 204 }, { gender: "Women", sec: 200 }, { gender: "Mixed", sec: 326 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 154 }, { gender: "Women", sec: 119 }, { gender: "Mixed", sec: 167 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 168 }, { gender: "Women", sec: 290 }, { gender: "Mixed", sec: 278 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 283 }, { gender: "Women", sec: 325 }, { gender: "Mixed", sec: 316 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 238 }, { gender: "Women", sec: 248 }, { gender: "Mixed", sec: 298 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 278 }, { gender: "Women", sec: 326 }, { gender: "Mixed", sec: 248 }] },
    ],
  },
];

const maxPace = Math.max(...PACE_ROWS.map((p) => p.paceSec));

// ---- Station records (timing-mat errors excluded: a split well below the athlete's level on their other stations) ----
const STATION_RECORDS: { station: string; time: string; who: string; division: string }[] = [
  { station: "SkiErg", time: "3:28", who: "J. Taylor / A. Mcgarry; A. Mckenna / N. Dunne", division: "Doubles 500 Men; Doubles 500 Mixed" },
  { station: "KB Farmers Carry", time: "1:06", who: "P. O'Connor; R. Allen / L. Kinsella", division: "Open 800 Men; Doubles 500 Women" },
  { station: "Ramfit Thrusters", time: "1:31", who: "L. Fitzpatrick / D. Browne", division: "Doubles 800 Women" },
  { station: "Sled Push", time: "0:53", who: "E. Lambe / S. Donnelly", division: "Doubles 800 Women" },
  { station: "Sled Pull", time: "1:35", who: "S. McGuckian / T. Byrne", division: "Doubles 800 Men" },
  { station: "Rowing", time: "3:40", who: "M. Murphy / R. Brennan", division: "Doubles 500 Men" },
  { station: "Lunges", time: "1:43", who: "A. Downey / J. Harte", division: "Doubles 800 Men" },
  { station: "Burpees", time: "1:22", who: "C. Tudor / G. Johnson", division: "Doubles 500 Men" },
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
              <td className="px-3 py-2 text-right tabular-nums">{r.athletes.toLocaleString()}</td>
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
        Pro Women and Pro Doubles Women had 14 entries each, so their 95th and 99th columns are the
        same single result: the winner.
      </p>
    </div>
  );
}

export default function DublinSeries2Race1Report() {
  return (
    <div className="space-y-10">
      {/* ---- Key Insights ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key Insights
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Josh Mckenna won Open 500 in <span className="tabular-nums">40:53</span>, 30 seconds
            faster than anyone managed in Series 1. Only four Doubles 500 men&apos;s pairs finished
            ahead of him all day.
          </li>
          <li>
            Mike and Mark Carmody won Doubles 800 men in <span className="tabular-nums">43:51</span>,
            a minute inside the Series 1 best. Mike has now won or placed in every Tryka race he has
            entered: <span className="tabular-nums">47:55</span> in Open 800,{" "}
            <span className="tabular-nums">45:30</span> in Doubles 800, then{" "}
            <span className="tabular-nums">44:25</span> to win Pro Doubles in Lisbon.
          </li>
          <li>
            Every Open and Doubles group finished faster at the median than at Dublin Summer Race 4,
            the last Tryka race in Dublin, by up to <span className="tabular-nums">6:19</span>. Pro
            Doubles went the other way: both of its medians were slower than at any Series 1 Dublin
            race.
          </li>
          <li>
            Women&apos;s Doubles 500 was the biggest single category Tryka has run:{" "}
            <span className="tabular-nums">1,181</span> pairs, or{" "}
            <span className="tabular-nums">2,362</span> athletes, almost a third of everyone racing.
          </li>
          <li>
            Charlie Tudor and Gregor Johnson took the fastest finish of the day,{" "}
            <span className="tabular-nums">37:46</span> in Doubles 500, and the fastest Burpees of the
            day too, <span className="tabular-nums">1:22</span>. Tudor had finished sixth in London.
          </li>
        </ul>
      </section>

      {/* ---- By the numbers ---- */}
      <section>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Athletes</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">7,801</div>
            <div className="mt-1 text-xs text-slate-400">across 4,530 entries</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest finish</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">37:46</div>
            <div className="mt-1 text-xs text-slate-400">C. Tudor / G. Johnson, Doubles 500</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">New faces</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">3,748</div>
            <div className="mt-1 text-xs text-slate-400">athletes with no Series 1 result</div>
          </div>
          <div className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4">
            <div className="text-xs uppercase tracking-wide text-tryka-green">Fastest solo</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">40:53</div>
            <div className="mt-1 text-xs text-slate-400">J. Mckenna, Open 500, a new best</div>
          </div>
        </div>
      </section>

      {/* ---- Race overview ---- */}
      <section>
        <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Race overview
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Only Dublin Summer Race 4 (<span className="tabular-nums">8,345</span> athletes) has been
          bigger. The first series opened with <span className="tabular-nums">3,798</span>. Of the{" "}
          <span className="tabular-nums">7,428</span> different athletes, about half (
          <span className="tabular-nums">3,748</span>) had no Series 1 result, and{" "}
          <span className="tabular-nums">13</span> of the athletes who raced all six Series 1 rounds
          were back. Doubles 500 was the biggest division by a distance, with{" "}
          <span className="tabular-nums">1,934</span> entries, and three in five of them were
          women&apos;s pairs. Women made up the largest group overall (
          <span className="tabular-nums">2,312</span> entries, against{" "}
          <span className="tabular-nums">1,525</span> men and <span className="tabular-nums">693</span>{" "}
          mixed teams). Open 800 leaned male (<span className="tabular-nums">466</span> men to{" "}
          <span className="tabular-nums">224</span> women), while Open 500 leaned female (
          <span className="tabular-nums">430</span> women to <span className="tabular-nums">289</span>{" "}
          men). The Doubles divisions moved to the five-year age groups that the Open divisions use,
          and 40–44 was the most common group of the day, just ahead of 35–39.
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
          Entries per division (a Doubles entry = two athletes; a Relay entry = four). New and
          returning athletes are matched by name, so the counts are approximate.
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
          the 25th is a bottom-quartile time. Doubles 500 men took nine of the ten fastest finishes;
          the other was Mckenna&apos;s Open 500. The Open 500 medians improved most on the first
          series&apos; Dublin opener: <span className="tabular-nums">3:21</span> faster for men and{" "}
          <span className="tabular-nums">4:52</span> for women. Pro Doubles was the exception. Its
          median men&apos;s pair took <span className="tabular-nums">58:21</span> and its median
          women&apos;s pair <span className="tabular-nums">1:08:57</span>, both slower than at every
          Series 1 Dublin race. The Pro women&apos;s field was the most spread out: the winner finished
          in <span className="tabular-nums">55:27</span>, and the slowest quarter took longer than{" "}
          <span className="tabular-nums">1:30:58</span>.
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
          and Pro Doubles averaged under <span className="tabular-nums">5:00/km</span>; the Doubles 500
          field averaged <span className="tabular-nums">6:40/km</span>. Everyone slowed as the race
          went on. In Open 500, the median first lap took <span className="tabular-nums">2:00</span>{" "}
          and the median eighth took <span className="tabular-nums">3:04</span>. Relay faded least (
          <span className="tabular-nums">3:17</span> to <span className="tabular-nums">3:42</span>),
          because each runner only covers part of the race. Doubles 800 pairs spent the most of their
          race running, <span className="tabular-nums">53%</span> at the median, against{" "}
          <span className="tabular-nums">36%</span> in Open 500.
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
                  <td className="px-3 py-2 text-right tabular-nums">{r.athletes.toLocaleString()}</td>
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
          Pro Doubles men had the fastest TRY Zone of any group, with a median of{" "}
          <span className="tabular-nums">4:03</span>, and Pro men were next at{" "}
          <span className="tabular-nums">4:39</span>. Open 800 women came within five seconds of the
          Open 800 men (<span className="tabular-nums">5:29</span> against{" "}
          <span className="tabular-nums">5:24</span>), despite finishing more than six minutes behind
          them at the median.
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
                  <td className="px-3 py-2 text-right tabular-nums">{r.athletes.toLocaleString()}</td>
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
          profile. Burpees separated the field most. In Open 500 the median man took{" "}
          <span className="tabular-nums">5:31</span> and the median woman{" "}
          <span className="tabular-nums">6:54</span>, while Tudor and Johnson did theirs in{" "}
          <span className="tabular-nums">1:22</span>. Doubles crews split the reps between two
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
            A split counts as a timing-mat error, and is excluded, when it is far faster than the same
            entry managed on its other stations. That removed between 7 (Rowing) and 134 (Burpees)
            splits per station, out of about 4,500.
          </p>
        </div>
      </section>

      {/* ---- Sprint finish ---- */}
      <section>
        <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Sprint finish
        </h2>
        <p className="text-sm leading-relaxed text-slate-300">
          The sprint to the line took a median of <span className="tabular-nums">12</span> seconds.
          Four entries shared the fastest time of <span className="tabular-nums">0:07</span>: Peter
          Slattery and Andrejs Galilejevs from Pro Doubles, Oisin Walsh from Open 500, and the
          Doubles 800 crews Patrick Lavery / Diarmuid Mckeown and Greg Duffy / Pádraig Duffy. All but
          five entries finished it inside a minute.
        </p>
      </section>

      {/* ---- Key takeaways ---- */}
      <section>
        <h2 className="mb-3 text-lg font-semibold uppercase tracking-wide text-tryka-green">
          Key takeaways
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Series 2 started big. The field was twice the size of the first series&apos; opener, and
            half of it was new to Tryka.
          </li>
          <li>
            The bulk of the field got faster. Every Open and Doubles median beat Dublin Summer Race 4,
            and two Series 1 division bests fell on the first day of the new series.
          </li>
          <li>
            Pro Doubles slowed down. Both of its medians were the slowest it has posted in Dublin.
          </li>
          <li>
            Fast athletes kept changing divisions. Mckenna had raced Doubles 800 and Pro before winning
            Open 500, and several other winners had moved over from a different division in Series 1.
          </li>
        </ul>
      </section>
    </div>
  );
}
