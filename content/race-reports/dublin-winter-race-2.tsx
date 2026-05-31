import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";
import StationStandards from "@/app/components/StationStandards";

// Stats computed from the tryka.db snapshot for DUBLIN WINTER RACE 2.
// Percentile groups with fewer than 5 athletes were dropped.
// Percentile direction: HIGHER = ELITE (99th column = fastest times, 25th = slowest).

export const intro =
  "Dublin Winter Race 2 brought 6,252 athletes to the start line across 3,790 entries, with Doubles 800 taking over from Doubles 500 as the day's biggest field. Darren Saunders and Jason Devereux blitzed the fastest finish in 39:11 — the only team under 40 minutes — and Chloe Sawyer pulled off a rare double, winning both her Doubles 800 and Open 800 races outright.";

type PercentileRow = {
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

const ATHLETES_PER_DIVISION: { label: string; value: number }[] = [
  { label: "Doubles 800", value: 1157 },
  { label: "Doubles 500", value: 1060 },
  { label: "Open 800", value: 767 },
  { label: "Open 500", value: 564 },
  { label: "Pro", value: 103 },
  { label: "Doubles Pro", value: 86 },
  { label: "Relay", value: 53 },
];

const GENDER_SPLIT: { label: string; value: number }[] = [
  { label: "Women", value: 1970 },
  { label: "Men", value: 1309 },
  { label: "Mixed", value: 511 },
];

const OVERALL_PERCENTILES: PercentileRow[] = [
  { division: "TRYKA DOUBLES PRO", gender: "Men", athletes: 56, p25: "1:00:05", p50: "55:48", p75: "52:01", p90: "47:37", p95: "45:34", p99: "43:10" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", athletes: 30, p25: "1:07:21", p50: "1:02:39", p75: "58:51", p90: "56:01", p95: "50:45", p99: "48:47" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 138, p25: "58:53", p50: "53:43", p75: "48:39", p90: "45:49", p95: "43:45", p99: "41:50" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 711, p25: "1:06:40", p50: "1:01:35", p75: "57:09", p90: "53:42", p95: "51:29", p99: "48:09" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 211, p25: "1:04:54", p50: "59:13", p75: "54:48", p90: "51:39", p95: "47:46", p99: "44:51" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 339, p25: "1:07:55", p50: "1:01:52", p75: "57:55", p90: "53:55", p95: "51:32", p99: "47:20" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 535, p25: "1:15:05", p50: "1:09:50", p75: "1:05:08", p90: "1:00:14", p95: "58:22", p99: "54:40" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 283, p25: "1:12:02", p50: "1:05:10", p75: "1:00:10", p90: "56:17", p95: "53:09", p99: "50:30" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 204, p25: "1:14:19", p50: "1:06:53", p75: "59:30", p90: "53:46", p95: "51:51", p99: "46:03" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 360, p25: "1:15:35", p50: "1:08:14", p75: "1:02:46", p90: "57:30", p95: "55:22", p99: "51:51" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 478, p25: "1:18:10", p50: "1:09:59", p75: "1:03:08", p90: "58:05", p95: "55:42", p99: "51:27" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 289, p25: "1:21:27", p50: "1:13:48", p75: "1:07:06", p90: "1:02:23", p95: "59:38", p99: "56:56" },
  { division: "TRYKA PRO", gender: "Men", athletes: 84, p25: "1:13:16", p50: "1:05:21", p75: "57:50", p90: "55:13", p95: "53:42", p99: "51:27" },
  { division: "TRYKA PRO", gender: "Women", athletes: 19, p25: "1:21:34", p50: "1:07:14", p75: "1:01:41", p90: "58:35", p95: "57:31", p99: "57:31" },
  { division: "TRYKA RELAY", gender: "Men", athletes: 10, p25: "1:06:23", p50: "1:02:35", p75: "57:28", p90: "49:02", p95: "48:41", p99: "48:41" },
  { division: "TRYKA RELAY", gender: "Women", athletes: 26, p25: "1:19:38", p50: "1:09:38", p75: "1:02:29", p90: "58:08", p95: "57:24", p99: "56:10" },
  { division: "TRYKA RELAY", gender: "Mixed", athletes: 17, p25: "1:08:47", p50: "59:34", p75: "56:39", p90: "50:31", p95: "45:10", p99: "45:10" },
];

type RunTotalRow = {
  division: string;
  gender: string;
  athletes: number;
  p25: string;
  p50: string;
  p75: string;
  p90: string;
  pace: string;
};

const RUN_TOTAL_ROWS: RunTotalRow[] = [
  { division: "TRYKA DOUBLES PRO", gender: "Men", athletes: 56, p25: "31:12", p50: "28:53", p75: "26:50", p90: "24:20", pace: "4:31 /km" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", athletes: 30, p25: "34:36", p50: "32:19", p75: "30:25", p90: "28:39", pace: "5:03 /km" },
  { division: "TRYKA PRO", gender: "Men", athletes: 84, p25: "32:22", p50: "29:18", p75: "26:58", p90: "25:37", pace: "4:35 /km" },
  { division: "TRYKA PRO", gender: "Women", athletes: 19, p25: "34:43", p50: "29:39", p75: "28:05", p90: "26:55", pace: "4:38 /km" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 478, p25: "35:25", p50: "32:25", p75: "29:33", p90: "27:23", pace: "5:04 /km" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 289, p25: "38:00", p50: "34:35", p75: "31:52", p90: "29:00", pace: "5:24 /km" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 204, p25: "25:57", p50: "23:32", p75: "21:17", p90: "19:14", pace: "5:53 /km" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 360, p25: "26:53", p50: "24:41", p75: "22:27", p90: "20:58", pace: "6:10 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 339, p25: "36:33", p50: "33:18", p75: "31:07", p90: "28:26", pace: "5:12 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 535, p25: "40:04", p50: "37:09", p75: "34:32", p90: "32:07", pace: "5:48 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 283, p25: "38:03", p50: "34:43", p75: "32:08", p90: "29:18", pace: "5:25 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 138, p25: "24:49", p50: "23:02", p75: "20:56", p90: "19:14", pace: "5:46 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 711, p25: "28:06", p50: "25:47", p75: "24:03", p90: "22:31", pace: "6:27 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 211, p25: "26:47", p50: "24:38", p75: "22:42", p90: "21:18", pace: "6:10 /km" },
];

const TRY_ZONE_ROWS: { division: string; gender: string; p50: string; p90: string }[] = [
  { division: "TRYKA DOUBLES PRO", gender: "Men", p50: "3:54", p90: "3:11" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", p50: "4:29", p90: "3:44" },
  { division: "TRYKA RELAY", gender: "Men", p50: "3:56", p90: "3:22" },
  { division: "TRYKA RELAY", gender: "Women", p50: "4:30", p90: "3:38" },
  { division: "TRYKA RELAY", gender: "Mixed", p50: "4:03", p90: "3:09" },
  { division: "TRYKA PRO", gender: "Men", p50: "4:09", p90: "3:19" },
  { division: "TRYKA PRO", gender: "Women", p50: "4:17", p90: "3:23" },
  { division: "TRYKA DOUBLES 800", gender: "Men", p50: "4:49", p90: "3:35" },
  { division: "TRYKA DOUBLES 800", gender: "Women", p50: "5:05", p90: "4:03" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", p50: "4:53", p90: "3:44" },
  { division: "TRYKA OPEN 800", gender: "Men", p50: "5:08", p90: "3:38" },
  { division: "TRYKA OPEN 800", gender: "Women", p50: "5:06", p90: "3:47" },
  { division: "TRYKA DOUBLES 500", gender: "Men", p50: "5:28", p90: "3:54" },
  { division: "TRYKA DOUBLES 500", gender: "Women", p50: "6:00", p90: "4:36" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", p50: "5:53", p90: "4:31" },
  { division: "TRYKA OPEN 500", gender: "Men", p50: "6:22", p90: "4:21" },
  { division: "TRYKA OPEN 500", gender: "Women", p50: "6:03", p90: "4:29" },
];

const STATION_DATA_BY_DIVISION: StationsByDivision[] = [
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 267 }, { gender: "Women", sec: 308 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 101 }, { gender: "Women", sec: 105 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 232 }, { gender: "Women", sec: 204 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 152 }, { gender: "Women", sec: 128 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 229 }, { gender: "Women", sec: 261 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 295 }, { gender: "Women", sec: 326 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 305 }, { gender: "Women", sec: 285 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 338 }, { gender: "Women", sec: 389 }] },
    ],
  },
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 275 }, { gender: "Women", sec: 316 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 113 }, { gender: "Women", sec: 113 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 264 }, { gender: "Women", sec: 225 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 151 }, { gender: "Women", sec: 134 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 248 }, { gender: "Women", sec: 305 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 312 }, { gender: "Women", sec: 342 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 361 }, { gender: "Women", sec: 334 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 454 }, { gender: "Women", sec: 484 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 238 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 254 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 85 }, { gender: "Women", sec: 94 }, { gender: "Mixed", sec: 92 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 163 }, { gender: "Women", sec: 170 }, { gender: "Mixed", sec: 181 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 93 }, { gender: "Women", sec: 88 }, { gender: "Mixed", sec: 104 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 159 }, { gender: "Women", sec: 207 }, { gender: "Mixed", sec: 190 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 274 }, { gender: "Women", sec: 310 }, { gender: "Mixed", sec: 284 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 205 }, { gender: "Women", sec: 206 }, { gender: "Mixed", sec: 220 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 210 }, { gender: "Women", sec: 267 }, { gender: "Mixed", sec: 218 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 242 }, { gender: "Women", sec: 291 }, { gender: "Mixed", sec: 260 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 104 }, { gender: "Mixed", sec: 104 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 172 }, { gender: "Women", sec: 177 }, { gender: "Mixed", sec: 192 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 101 }, { gender: "Women", sec: 92 }, { gender: "Mixed", sec: 110 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 174 }, { gender: "Women", sec: 223 }, { gender: "Mixed", sec: 209 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 282 }, { gender: "Women", sec: 322 }, { gender: "Mixed", sec: 300 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 216 }, { gender: "Women", sec: 235 }, { gender: "Mixed", sec: 255 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 234 }, { gender: "Women", sec: 316 }, { gender: "Mixed", sec: 272 }] },
    ],
  },
  {
    division: "Doubles Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 226 }, { gender: "Women", sec: 259 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 86 }, { gender: "Women", sec: 101 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 199 }, { gender: "Women", sec: 208 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 100 }, { gender: "Women", sec: 115 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 178 }, { gender: "Women", sec: 209 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 257 }, { gender: "Women", sec: 286 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 196 }, { gender: "Women", sec: 216 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 163 }, { gender: "Women", sec: 191 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 291 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 95 }, { gender: "Women", sec: 106 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 257 }, { gender: "Women", sec: 298 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 189 }, { gender: "Women", sec: 184 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 249 }, { gender: "Women", sec: 255 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 277 }, { gender: "Women", sec: 307 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 295 }, { gender: "Women", sec: 296 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 240 }, { gender: "Women", sec: 260 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 277 }, { gender: "Women", sec: 307 }, { gender: "Mixed", sec: 286 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 103 }, { gender: "Mixed", sec: 110 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 206 }, { gender: "Women", sec: 182 }, { gender: "Mixed", sec: 202 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 106 }, { gender: "Women", sec: 112 }, { gender: "Mixed", sec: 122 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 194 }, { gender: "Women", sec: 262 }, { gender: "Mixed", sec: 218 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 294 }, { gender: "Women", sec: 326 }, { gender: "Mixed", sec: 304 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 285 }, { gender: "Mixed", sec: 236 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 293 }, { gender: "Women", sec: 301 }, { gender: "Mixed", sec: 259 }] },
    ],
  },
];

const STATION_FASTEST: {
  station: string;
  time: string;
  name: string;
  division: string;
}[] = [
  { station: "SkiErg", time: "3:27", name: "Jack Armstrong / Enda O'Hora", division: "DOUBLES 800 Men" },
  { station: "KB Farmers Carry", time: "1:02", name: "Paul Timmons / Grainne Gillett", division: "DOUBLES 800 Mixed" },
  { station: "Ramfit Thrusters", time: "1:38", name: "Jessica Carnegie / Sharon Reel", division: "DOUBLES 500 Women" },
  { station: "Sled Push", time: "0:58", name: "Aran Murray / Jared Murray", division: "DOUBLES 800 Men" },
  { station: "Sled Pull", time: "1:48", name: "Brian McDermott / Alan Kennedy", division: "DOUBLES 800 Men" },
  { station: "Rowing", time: "3:40", name: "Aran Murray / Jared Murray", division: "DOUBLES 800 Men" },
  { station: "Lunges", time: "1:34", name: "Ronan Donnelly", division: "OPEN 800 Men" },
  { station: "Burpees", time: "1:35", name: "Michael Dowling / Paddy Syme", division: "DOUBLES PRO Men" },
];

const SPRINT = { fastest: "0:07", median: "0:13", p90: "0:10" };

const RUN_FADE: { division: string; r1: string; r8: string; delta: number }[] = [
  { division: "DOUBLES 500 Women", r1: "2:23", r8: "3:12", delta: 49 },
  { division: "DOUBLES 800 Women", r1: "3:46", r8: "4:38", delta: 52 },
  { division: "DOUBLES 800 Mixed", r1: "3:25", r8: "4:18", delta: 53 },
  { division: "DOUBLES 500 Mixed", r1: "2:10", r8: "3:03", delta: 53 },
  { division: "DOUBLES PRO Men", r1: "2:43", r8: "3:39", delta: 56 },
  { division: "DOUBLES PRO Women", r1: "3:06", r8: "4:02", delta: 56 },
  { division: "DOUBLES 800 Men", r1: "3:16", r8: "4:13", delta: 57 },
  { division: "PRO Women", r1: "2:47", r8: "3:44", delta: 57 },
  { division: "DOUBLES 500 Men", r1: "1:59", r8: "2:59", delta: 60 },
  { division: "OPEN 500 Women", r1: "2:08", r8: "3:09", delta: 61 },
  { division: "OPEN 800 Women", r1: "3:22", r8: "4:25", delta: 63 },
  { division: "PRO Men", r1: "2:45", r8: "3:48", delta: 63 },
  { division: "OPEN 500 Men", r1: "1:57", r8: "3:10", delta: 73 },
  { division: "OPEN 800 Men", r1: "2:58", r8: "4:16", delta: 78 },
];

export default function DublinWinterRace2Report() {
  return (
    <div className="space-y-10">
      <CalloutStrip />

      <Section title="Key Insights">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Doubles 800 was the day's biggest field at 1,157 athletes, edging out Doubles 500
            (1,060) — a flip from the Spring race.
          </li>
          <li>
            Chloe Sawyer won Doubles 800 Women in 50:01 and then went on to win Open 800 Women in
            54:36 — the day's standout repeat performance.
          </li>
          <li>
            The Murray brothers — Aran and Jared — set the fastest single-team times on both Sled
            Push (0:58) and Rowing (3:40), the only team to top two stations.
          </li>
          <li>
            Burpees in Open 500 was brutal: median 7:34 for Men and 8:04 for Women, more than three
            times the Doubles Pro Men median of 2:43.
          </li>
          <li>
            Doubles 500 Women held pace best across the eight runs — only 49 seconds of fade
            between Run 1 and Run 8, vs 73–78 seconds in the Open Men fields.
          </li>
        </ul>
      </Section>

      <Section title="Race overview">
        <p className="mb-4 text-sm text-slate-300">
          6,252 athletes raced across seven divisions. Each Doubles entry is a team of two and
          each Relay entry a team of four, so the 3,790 start-line entries represented 6,252
          people in total. By category, 1,970 women's entries outnumbered 1,309 men's; mixed
          teams added 511. The largest age bands by entry count were 40–49 (901), 30–39 (853) and
          20–29 (378).
        </p>

        <h3 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Entries per division</h3>
        <BarChart
          data={ATHLETES_PER_DIVISION}
          max={Math.max(...ATHLETES_PER_DIVISION.map((d) => d.value))}
          labelWidth={140}
        />

        <h3 className="mb-2 mt-6 text-xs uppercase tracking-wide text-slate-400">Entries by gender category</h3>
        <BarChart
          data={GENDER_SPLIT}
          max={Math.max(...GENDER_SPLIT.map((d) => d.value))}
          labelWidth={100}
        />
      </Section>

      <Section title="Division performance — finish times">
        <p className="mb-2 text-sm text-slate-300">
          Overall finish time, split by division and gender. Columns go left-to-right from weak to
          elite: the 99th column is the time achieved by the top 1% of each field; the 25th is
          what you'd see in the bottom quartile. Groups with fewer than five athletes are excluded.
        </p>
        <PercentileTable rows={OVERALL_PERCENTILES} />
      </Section>

      <Section title="Running — Runs 1 through 8 combined">
        <p className="mb-4 text-sm text-slate-300">
          The eight running laps add up to between 4 km (the 500 formats) and 6.4 km (the 800
          formats, Pro and Relay). Doubles Pro Men ran the day's fastest median pace at 4:31/km;
          Open 800 Men, the largest individual field, sat at 5:04/km — narrowly faster than the
          Spring race.
        </p>

        <RunTotalTable rows={RUN_TOTAL_ROWS} />

        <h3 className="mb-3 mt-8 text-xs uppercase tracking-wide text-slate-400">
          Pace fade — Running 1 vs Running 8 (median)
        </h3>
        <p className="mb-3 text-sm text-slate-300">
          How much slower did athletes get over the course of the race? Lower is better.
        </p>
        <RunFadeTable rows={RUN_FADE} />
      </Section>

      <Section title="TRY Zone">
        <p className="mb-4 text-sm text-slate-300">
          The TRY Zone is the back half of the workout. Doubles Pro Men cleared it in a median
          3:54 — barely two seconds slower than Relay Men (3:56), the day's two fastest groups.
          Open 500 Men's 6:22 median sat at the slow end of the field.
        </p>
        <TryZoneTable rows={TRY_ZONE_ROWS} />
      </Section>

      <Section title="Workout stations">
        <p className="mb-6 text-sm text-slate-300">
          Median time on each of the eight workout stations. Pick a division below; bars are
          grouped by gender within each station, and the chart scales to that division. Watch the
          Open formats for the same Lunges and Thrusters flip seen in Spring — women were faster
          than men in both Open 500 and Open 800. The Doubles Pro chart shows where the elite gap
          opens up: Burpees in 2:43 for Men, 3:11 for Women, both about half the time of any Open
          format.
        </p>

        <StationPicker divisions={STATION_DATA_BY_DIVISION} />

        <StationStandards />

        <h3 className="mb-3 mt-8 text-xs uppercase tracking-wide text-slate-400">
          Fastest single time per station
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATION_FASTEST.map((s) => (
            <div
              key={s.station}
              className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm"
            >
              <div className="text-xs uppercase tracking-wide text-slate-400">{s.station}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{s.time}</div>
              <div className="mt-1 text-xs text-slate-400">{s.name}</div>
              <div className="text-[10px] uppercase tracking-wide text-slate-500">{s.division}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sprint finish">
        <p className="mb-4 text-sm text-slate-300">
          The Running Finish Sprint clocks the last few metres into the line. Median was 13
          seconds, and the fastest finisher dipped under 8.
        </p>
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Fastest" value={SPRINT.fastest} />
          <StatTile label="Median" value={SPRINT.median} />
          <StatTile label="90th pct" value={SPRINT.p90} />
        </div>
      </Section>

      <Section title="Key takeaways">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            The repeat-winner story isn't just Chloe Sawyer — Grace Fitzgerald and Ellie Carmody
            won Doubles Pro Women here in 48:47 and went on to repeat in the Spring race.
          </li>
          <li>
            Burpees was the standout pain point. Doubles 500 Men medianed 3:54 and Open 500 Men
            ballooned to 7:34 — a four-minute swing on a single station tells you most of the
            story about why team formats beat individual ones.
          </li>
          <li>
            Lunges and Thrusters flipped the gender order again in Open formats: women medianed
            faster than men on both stations in Open 500 and Open 800, the same pattern that held
            in Spring. Sled Push too. Three stations where individual-format women consistently
            outpace individual-format men.
          </li>
          <li>
            Pacing held best among the largest doubles fields. Doubles 500 Women's 49-second fade
            was the day's lowest; Open 800 Men's 78 seconds was the worst. Format and pacing
            discipline track together.
          </li>
        </ul>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide text-tryka-green">{title}</h2>
      {children}
    </section>
  );
}

function CalloutStrip() {
  const items = [
    { label: "Athletes", value: "6,252" },
    { label: "Largest field", value: "1,157" },
    { label: "Fastest finish", value: "39:11" },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-tryka-green/30 bg-tryka-green/10 p-4"
        >
          <div className="text-xs uppercase tracking-wide text-tryka-green">{it.label}</div>
          <div className="mt-1 text-2xl font-semibold tabular-nums">{it.value}</div>
        </div>
      ))}
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-tryka-navy-light bg-tryka-navy-light p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function BarChart({
  data,
  max,
  labelWidth = 140,
}: {
  data: { label: string; value: number }[];
  max: number;
  labelWidth?: number;
}) {
  const ROW_HEIGHT = 26;
  const BAR_WIDTH = 340;
  return (
    <svg
      viewBox={`0 0 600 ${data.length * ROW_HEIGHT + 10}`}
      className="w-full"
      role="img"
      aria-label="Bar chart"
    >
      <g transform={`translate(${labelWidth}, 5)`}>
        {data.map((d, i) => {
          const w = Math.max(2, Math.round((d.value / max) * BAR_WIDTH));
          const y = i * ROW_HEIGHT;
          return (
            <g key={d.label}>
              <text x={-10} y={y + 17} textAnchor="end" fill="#94a3b8" fontSize="11">
                {d.label}
              </text>
              <rect x={0} y={y + 6} width={w} height={14} fill="#06e38b" />
              <text x={w + 8} y={y + 17} fill="#ffffff" fontSize="11" className="tabular-nums">
                {d.value.toLocaleString()}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function PercentileTable({ rows }: { rows: PercentileRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">N</th>
            <th className="px-3 py-2 text-right">25th</th>
            <th className="px-3 py-2 text-right">50th</th>
            <th className="px-3 py-2 text-right">75th</th>
            <th className="px-3 py-2 text-right">90th</th>
            <th className="px-3 py-2 text-right">95th</th>
            <th className="px-3 py-2 text-right text-tryka-green">99th</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {rows.map((r) => (
            <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2">{r.division}</td>
              <td className="px-3 py-2">{r.gender}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.athletes}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p25}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p75}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p90}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p95}</td>
              <td className="px-3 py-2 text-right tabular-nums text-tryka-green">{r.p99}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RunTotalTable({ rows }: { rows: RunTotalRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">N</th>
            <th className="px-3 py-2 text-right">25th</th>
            <th className="px-3 py-2 text-right">50th</th>
            <th className="px-3 py-2 text-right">75th</th>
            <th className="px-3 py-2 text-right text-tryka-green">90th</th>
            <th className="px-3 py-2 text-right">Median pace</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {rows.map((r) => (
            <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2">{r.division}</td>
              <td className="px-3 py-2">{r.gender}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.athletes}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p25}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p75}</td>
              <td className="px-3 py-2 text-right tabular-nums text-tryka-green">{r.p90}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.pace}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TryZoneTable({ rows }: { rows: typeof TRY_ZONE_ROWS }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2">Gender</th>
            <th className="px-3 py-2 text-right">Median</th>
            <th className="px-3 py-2 text-right text-tryka-green">90th</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {rows.map((r) => (
            <tr key={`${r.division}-${r.gender}`} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2">{r.division}</td>
              <td className="px-3 py-2">{r.gender}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.p50}</td>
              <td className="px-3 py-2 text-right tabular-nums text-tryka-green">{r.p90}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RunFadeTable({ rows }: { rows: typeof RUN_FADE }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-tryka-navy-light">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-tryka-navy-light text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-3 py-2">Division</th>
            <th className="px-3 py-2 text-right">Run 1</th>
            <th className="px-3 py-2 text-right">Run 8</th>
            <th className="px-3 py-2 text-right">Fade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tryka-navy-light">
          {rows.map((r) => (
            <tr key={r.division} className="hover:bg-tryka-navy-light/50">
              <td className="px-3 py-2">{r.division}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.r1}</td>
              <td className="px-3 py-2 text-right tabular-nums">{r.r8}</td>
              <td className="px-3 py-2 text-right tabular-nums text-tryka-green">+{r.delta}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
