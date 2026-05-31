import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

// Stats computed from the tryka.db snapshot for DUBLIN AUTUMN RACE 1.
// Percentile groups with fewer than 5 athletes were dropped.
// Percentile direction: HIGHER = ELITE (99th column = fastest times, 25th = slowest).

export const intro =
  "Dublin Autumn Race 1 was the start of the series — 2,316 athletes, the smallest of the three Dublin races, but where the patterns were set. Doubles 800 swept the day's station records, Open 500 drew twice as many women as men, and Ellie Carmody won Pro Women in 56:50, kicking off what became a multi-race winning streak.";

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
  { label: "Doubles 800", value: 729 },
  { label: "Open 800", value: 597 },
  { label: "Doubles 500", value: 515 },
  { label: "Open 500", value: 270 },
  { label: "Pro", value: 83 },
  { label: "Doubles Pro", value: 65 },
  { label: "Relay", value: 57 },
];

const GENDER_SPLIT: { label: string; value: number }[] = [
  { label: "Women", value: 1177 },
  { label: "Men", value: 831 },
  { label: "Mixed", value: 308 },
];

const OVERALL_PERCENTILES: PercentileRow[] = [
  { division: "TRYKA DOUBLES PRO", gender: "Men", athletes: 26, p25: "1:07:17", p50: "55:28", p75: "52:07", p90: "46:51", p95: "46:28", p99: "43:26" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", athletes: 39, p25: "1:12:49", p50: "1:05:02", p75: "1:01:26", p90: "57:04", p95: "54:19", p99: "49:34" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 60, p25: "1:03:32", p50: "55:43", p75: "50:02", p90: "48:20", p95: "46:59", p99: "40:55" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 355, p25: "1:09:04", p50: "1:03:40", p75: "58:59", p90: "55:08", p95: "52:56", p99: "49:41" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 100, p25: "1:06:46", p50: "1:02:15", p75: "57:51", p90: "54:00", p95: "50:48", p99: "47:55" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 219, p25: "1:09:50", p50: "1:03:15", p75: "58:28", p90: "52:01", p95: "48:33", p99: "46:43" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 320, p25: "1:18:43", p50: "1:12:14", p75: "1:06:41", p90: "1:02:38", p95: "1:00:01", p99: "56:33" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 190, p25: "1:14:49", p50: "1:08:25", p75: "1:01:49", p90: "57:28", p95: "55:59", p99: "50:58" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 87, p25: "1:15:50", p50: "1:08:13", p75: "1:00:27", p90: "54:58", p95: "50:32", p99: "44:35" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 183, p25: "1:21:21", p50: "1:12:59", p75: "1:06:26", p90: "58:03", p95: "54:46", p99: "51:15" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 369, p25: "1:19:17", p50: "1:10:34", p75: "1:03:04", p90: "57:37", p95: "55:02", p99: "50:23" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 228, p25: "1:26:09", p50: "1:16:08", p75: "1:10:16", p90: "1:04:25", p95: "1:02:39", p99: "59:57" },
  { division: "TRYKA PRO", gender: "Men", athletes: 58, p25: "1:07:58", p50: "1:03:51", p75: "57:27", p90: "54:13", p95: "51:22", p99: "49:22" },
  { division: "TRYKA PRO", gender: "Women", athletes: 25, p25: "1:17:48", p50: "1:11:33", p75: "1:03:19", p90: "58:19", p95: "57:20", p99: "56:50" },
  { division: "TRYKA RELAY", gender: "Men", athletes: 12, p25: "1:12:39", p50: "1:01:00", p75: "54:04", p90: "49:43", p95: "49:16", p99: "49:16" },
  { division: "TRYKA RELAY", gender: "Women", athletes: 27, p25: "1:24:17", p50: "1:18:12", p75: "1:07:40", p90: "1:03:29", p95: "1:02:08", p99: "1:00:42" },
  { division: "TRYKA RELAY", gender: "Mixed", athletes: 18, p25: "1:08:49", p50: "1:08:01", p75: "56:19", p90: "53:04", p95: "52:53", p99: "52:53" },
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
  { division: "TRYKA DOUBLES PRO", gender: "Men", athletes: 26, p25: "35:44", p50: "29:36", p75: "27:12", p90: "24:41", pace: "4:38 /km" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", athletes: 39, p25: "35:38", p50: "33:58", p75: "30:57", p90: "28:38", pace: "5:18 /km" },
  { division: "TRYKA PRO", gender: "Men", athletes: 58, p25: "31:58", p50: "29:05", p75: "27:05", p90: "25:18", pace: "4:33 /km" },
  { division: "TRYKA PRO", gender: "Women", athletes: 25, p25: "34:50", p50: "31:53", p75: "28:22", p90: "26:45", pace: "4:59 /km" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 368, p25: "36:46", p50: "32:55", p75: "29:50", p90: "27:18", pace: "5:09 /km" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 227, p25: "39:04", p50: "36:09", p75: "33:25", p90: "30:47", pace: "5:39 /km" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 87, p25: "27:19", p50: "24:19", p75: "21:41", p90: "19:34", pace: "6:05 /km" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 183, p25: "28:10", p50: "25:41", p75: "23:07", p90: "21:28", pace: "6:25 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 219, p25: "37:55", p50: "33:43", p75: "31:16", p90: "28:01", pace: "5:16 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 318, p25: "41:48", p50: "38:32", p75: "35:30", p90: "33:16", pace: "6:01 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 190, p25: "38:55", p50: "36:02", p75: "32:44", p90: "30:19", pace: "5:38 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 59, p25: "27:27", p50: "24:12", p75: "22:08", p90: "20:25", pace: "6:03 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 355, p25: "29:02", p50: "26:32", p75: "24:35", p90: "22:47", pace: "6:38 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 100, p25: "28:45", p50: "26:48", p75: "24:19", p90: "22:31", pace: "6:42 /km" },
];

const TRY_ZONE_ROWS: { division: string; gender: string; p50: string; p90: string }[] = [
  { division: "TRYKA DOUBLES PRO", gender: "Men", p50: "3:46", p90: "2:59" },
  { division: "TRYKA DOUBLES PRO", gender: "Women", p50: "4:49", p90: "3:34" },
  { division: "TRYKA PRO", gender: "Men", p50: "4:01", p90: "3:23" },
  { division: "TRYKA PRO", gender: "Women", p50: "4:39", p90: "3:32" },
  { division: "TRYKA RELAY", gender: "Men", p50: "4:57", p90: "4:11" },
  { division: "TRYKA RELAY", gender: "Women", p50: "6:41", p90: "5:08" },
  { division: "TRYKA RELAY", gender: "Mixed", p50: "5:06", p90: "4:23" },
  { division: "TRYKA DOUBLES 800", gender: "Men", p50: "5:00", p90: "3:32" },
  { division: "TRYKA DOUBLES 800", gender: "Women", p50: "6:30", p90: "4:27" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", p50: "5:33", p90: "4:00" },
  { division: "TRYKA OPEN 800", gender: "Men", p50: "5:10", p90: "3:38" },
  { division: "TRYKA OPEN 800", gender: "Women", p50: "5:32", p90: "4:07" },
  { division: "TRYKA DOUBLES 500", gender: "Men", p50: "5:26", p90: "4:15" },
  { division: "TRYKA DOUBLES 500", gender: "Women", p50: "6:44", p90: "4:56" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", p50: "6:44", p90: "4:54" },
  { division: "TRYKA OPEN 500", gender: "Men", p50: "6:20", p90: "4:16" },
  { division: "TRYKA OPEN 500", gender: "Women", p50: "6:50", p90: "4:51" },
];

const STATION_DATA_BY_DIVISION: StationsByDivision[] = [
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 264 }, { gender: "Women", sec: 307 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 102 }, { gender: "Women", sec: 107 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 236 }, { gender: "Women", sec: 224 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 121 }, { gender: "Women", sec: 137 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 219 }, { gender: "Women", sec: 275 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 298 }, { gender: "Women", sec: 330 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 303 }, { gender: "Women", sec: 278 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 372 }, { gender: "Women", sec: 410 }] },
    ],
  },
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 272 }, { gender: "Women", sec: 320 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 113 }, { gender: "Women", sec: 113 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 271 }, { gender: "Women", sec: 260 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 119 }, { gender: "Women", sec: 148 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 211 }, { gender: "Women", sec: 322 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 318 }, { gender: "Women", sec: 351 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 388 }, { gender: "Women", sec: 326 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 510 }, { gender: "Women", sec: 520 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 237 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 252 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 85 }, { gender: "Women", sec: 96 }, { gender: "Mixed", sec: 95 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 166 }, { gender: "Women", sec: 182 }, { gender: "Mixed", sec: 189 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 92 }, { gender: "Mixed", sec: 107 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 163 }, { gender: "Women", sec: 206 }, { gender: "Mixed", sec: 195 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 273 }, { gender: "Women", sec: 307 }, { gender: "Mixed", sec: 292 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 200 }, { gender: "Women", sec: 200 }, { gender: "Mixed", sec: 221 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 223 }, { gender: "Women", sec: 279 }, { gender: "Mixed", sec: 247 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 245 }, { gender: "Women", sec: 288 }, { gender: "Mixed", sec: 262 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 98 }, { gender: "Women", sec: 103 }, { gender: "Mixed", sec: 106 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 176 }, { gender: "Women", sec: 195 }, { gender: "Mixed", sec: 199 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 97 }, { gender: "Women", sec: 98 }, { gender: "Mixed", sec: 109 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 166 }, { gender: "Women", sec: 227 }, { gender: "Mixed", sec: 213 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 288 }, { gender: "Women", sec: 330 }, { gender: "Mixed", sec: 308 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 207 }, { gender: "Women", sec: 227 }, { gender: "Mixed", sec: 256 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 276 }, { gender: "Women", sec: 335 }, { gender: "Mixed", sec: 282 }] },
    ],
  },
  {
    division: "Doubles Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 230 }, { gender: "Women", sec: 264 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 86 }, { gender: "Women", sec: 100 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 173 }, { gender: "Women", sec: 213 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 93 }, { gender: "Women", sec: 110 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 181 }, { gender: "Women", sec: 216 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 250 }, { gender: "Women", sec: 291 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 192 }, { gender: "Women", sec: 224 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 156 }, { gender: "Women", sec: 202 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 248 }, { gender: "Women", sec: 281 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 96 }, { gender: "Women", sec: 115 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 227 }, { gender: "Women", sec: 290 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 172 }, { gender: "Women", sec: 179 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 247 }, { gender: "Women", sec: 253 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 270 }, { gender: "Women", sec: 303 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 264 }, { gender: "Women", sec: 285 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 220 }, { gender: "Women", sec: 282 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 280 }, { gender: "Women", sec: 319 }, { gender: "Mixed", sec: 294 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 90 }, { gender: "Women", sec: 109 }, { gender: "Mixed", sec: 103 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 196 }, { gender: "Women", sec: 216 }, { gender: "Mixed", sec: 189 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 99 }, { gender: "Women", sec: 114 }, { gender: "Mixed", sec: 105 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 152 }, { gender: "Women", sec: 255 }, { gender: "Mixed", sec: 185 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 295 }, { gender: "Women", sec: 338 }, { gender: "Mixed", sec: 289 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 284 }, { gender: "Women", sec: 280 }, { gender: "Mixed", sec: 243 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 253 }, { gender: "Women", sec: 368 }, { gender: "Mixed", sec: 232 }] },
    ],
  },
];

const STATION_FASTEST: {
  station: string;
  time: string;
  name: string;
  division: string;
}[] = [
  { station: "SkiErg", time: "3:01", name: "Tara Donnelly / Albert Martin", division: "DOUBLES 800 Mixed" },
  { station: "KB Farmers Carry", time: "1:05", name: "Ruth Conlan-Trant / Darren Buttle", division: "DOUBLES 800 Mixed" },
  { station: "Ramfit Thrusters", time: "1:54", name: "Seanan McColgan / Damian Duffy", division: "DOUBLES 800 Men" },
  { station: "Sled Push", time: "1:00", name: "Jason Coster / Darren Bourke", division: "DOUBLES 800 Men" },
  { station: "Sled Pull", time: "1:31", name: "Colm Nealon / Sean Byrne", division: "DOUBLES 800 Men" },
  { station: "Rowing", time: "3:00", name: "Karen Dunne / Saskia O'Connor", division: "DOUBLES 800 Women" },
  { station: "Lunges", time: "1:51", name: "Ciara A Murphy / Lisa Hanley", division: "DOUBLES 800 Women" },
  { station: "Burpees", time: "1:39", name: "Ciaran Quinn / Declan Moylett", division: "DOUBLES PRO Men" },
];

const SPRINT = { fastest: "0:07", median: "0:12", p90: "0:09" };

const RUN_FADE: { division: string; r1: string; r8: string; delta: number }[] = [
  { division: "DOUBLES 500 Mixed", r1: "2:29", r8: "3:17", delta: 48 },
  { division: "DOUBLES 800 Men", r1: "3:22", r8: "4:12", delta: 50 },
  { division: "DOUBLES 500 Women", r1: "2:25", r8: "3:15", delta: 50 },
  { division: "DOUBLES 800 Women", r1: "3:56", r8: "4:47", delta: 51 },
  { division: "DOUBLES 500 Men", r1: "2:09", r8: "3:01", delta: 52 },
  { division: "DOUBLES PRO Men", r1: "2:43", r8: "3:36", delta: 53 },
  { division: "DOUBLES 800 Mixed", r1: "3:33", r8: "4:30", delta: 57 },
  { division: "DOUBLES PRO Women", r1: "3:17", r8: "4:15", delta: 58 },
  { division: "OPEN 800 Women", r1: "3:31", r8: "4:31", delta: 60 },
  { division: "PRO Men", r1: "2:40", r8: "3:47", delta: 67 },
  { division: "OPEN 500 Women", r1: "2:10", r8: "3:19", delta: 69 },
  { division: "PRO Women", r1: "2:50", r8: "3:59", delta: 69 },
  { division: "OPEN 800 Men", r1: "3:03", r8: "4:21", delta: 78 },
  { division: "OPEN 500 Men", r1: "1:54", r8: "3:20", delta: 86 },
];

export default function DublinAutumnRace1Report() {
  return (
    <div className="space-y-10">
      <CalloutStrip />

      <Section title="TL;DR">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Doubles 800 owned the station record book — seven of the eight fastest single-team
            times of the day came from this one division.
          </li>
          <li>
            Open 500 drew more than two women for every man — 183 Women vs 87 Men — the most
            gender-skewed entry-level field of the three Dublin races.
          </li>
          <li>
            Open 500 Men's pace fade was the worst across all three Dublin races: an 86-second
            median slowdown from Run 1 to Run 8.
          </li>
          <li>
            Burpees in Open 500 was the day's grimmest single station — median 8:30 for Men and
            8:40 for Women, more than three times the Doubles Pro Men median of 2:36.
          </li>
          <li>
            Dean Nolan and Shane Veale set the day's fastest finish at 40:55 in Doubles 500 Men.
            Connor Magill (Pro Men, 49:22) and Ellie Carmody (Pro Women, 56:50) topped the elite
            individual fields.
          </li>
        </ul>
      </Section>

      <Section title="Race overview">
        <p className="mb-4 text-sm text-slate-300">
          2,316 athletes raced across seven divisions — the smallest field of the three Dublin
          races. Women outnumbered men 1,177 to 831; mixed teams added 308. The largest age bands
          were 40–49 (513), 30–39 (495) and 20–29 (198).
        </p>

        <h3 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Athletes per division</h3>
        <BarChart
          data={ATHLETES_PER_DIVISION}
          max={Math.max(...ATHLETES_PER_DIVISION.map((d) => d.value))}
          labelWidth={140}
        />

        <h3 className="mb-2 mt-6 text-xs uppercase tracking-wide text-slate-400">Gender split</h3>
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
          formats, Pro and Relay). Pro Men ran the day's fastest median pace at 4:33/km — narrowly
          edging Doubles Pro Men at 4:38/km, the only race of the three Dublin events where the
          individual elites outran the doubles elites on pace.
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
          3:46, the day's fastest group, just over a second a kilometre quicker than individual
          Pro Men at 4:01. The slowest large groups were both Open 500 fields, with medians around
          6:20–6:50.
        </p>
        <TryZoneTable rows={TRY_ZONE_ROWS} />
      </Section>

      <Section title="Workout stations — gender gap by division">
        <p className="mb-6 text-sm text-slate-300">
          Median time on each of the eight workout stations. Pick a division below; bars are
          grouped by gender within each station, and the chart scales to that division. The same
          Lunges and Thrusters gender flip that appears in the other Dublin reports is already
          here in Autumn 1 — women medianed faster on both stations in Open 500 and Open 800. The
          pattern has now held across all three races.
        </p>

        <StationPicker divisions={STATION_DATA_BY_DIVISION} />

        <h3 className="mb-3 mt-8 text-xs uppercase tracking-wide text-slate-400">
          Fastest single time per station
        </h3>
        <p className="mb-3 text-sm text-slate-400">
          Seven of the eight station records were set by Doubles 800 teams — the only outlier was
          Burpees, taken by a Doubles Pro pair.
        </p>
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
          The Running Finish Sprint clocks the last few metres into the line. Median was 12
          seconds; the fastest finisher hit the mat in 7.
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
            Doubles 800 dominance on the stations is striking — every fast single-team time except
            Burpees came from this one division. Even the doubles-pro elites couldn't beat them on
            seven of eight stations.
          </li>
          <li>
            The pace-fade hierarchy is consistent with the other Dublin races, but Open 500 Men's
            86-second slowdown is the worst single bucket across any race. Pacing discipline
            tracks with format experience.
          </li>
          <li>
            The Open 500 women-to-men ratio of more than 2:1 stands out — by the time the format
            settles into Winter and Spring, the gap narrows. The entry-level individual race was
            women's territory at the start of the series.
          </li>
          <li>
            Ellie Carmody's Pro Women win here in 56:50 was the start of a streak — she'd go on
            to win Doubles Pro Women in both Winter Race 2 (with Grace Fitzgerald) and Spring
            Race 3. The most consistent elite performer of the three Dublin races.
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
    { label: "Athletes", value: "2,316" },
    { label: "Largest field", value: "729" },
    { label: "Fastest finish", value: "40:55" },
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
