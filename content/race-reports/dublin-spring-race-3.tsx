import StationPicker, { type StationsByDivision } from "@/app/components/StationPicker";

// Stats computed from the tryka.db snapshot for DUBLIN SPRING RACE 3.
// Percentile groups with fewer than 5 athletes were dropped.
// Percentile direction: HIGHER = ELITE (99th column = fastest times, 25th = slowest).

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
  { label: "Doubles 500", value: 1597 },
  { label: "Doubles 800", value: 1281 },
  { label: "Open 800", value: 805 },
  { label: "Open 500", value: 578 },
  { label: "Pro Doubles", value: 89 },
  { label: "Pro", value: 83 },
  { label: "Relay", value: 62 },
];

const GENDER_SPLIT: { label: string; value: number }[] = [
  { label: "Women", value: 2302 },
  { label: "Men", value: 1444 },
  { label: "Mixed", value: 749 },
];

const OVERALL_PERCENTILES: PercentileRow[] = [
  { division: "TRYKA PRO DOUBLES", gender: "Men", athletes: 59, p25: "1:03:43", p50: "55:16", p75: "49:37", p90: "47:59", p95: "47:22", p99: "46:22" },
  { division: "TRYKA PRO DOUBLES", gender: "Women", athletes: 30, p25: "1:08:45", p50: "1:02:59", p75: "57:17", p90: "51:13", p95: "50:17", p99: "48:15" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 222, p25: "58:49", p50: "54:18", p75: "49:17", p90: "45:33", p95: "43:54", p99: "42:52" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 1009, p25: "1:07:27", p50: "1:00:59", p75: "56:08", p90: "52:27", p95: "50:39", p99: "46:46" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 366, p25: "1:04:35", p50: "57:44", p75: "53:17", p90: "49:28", p95: "47:25", p99: "44:41" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 410, p25: "1:07:10", p50: "1:02:26", p75: "57:23", p90: "52:19", p95: "49:07", p99: "46:04" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 504, p25: "1:13:38", p50: "1:09:15", p75: "1:04:17", p90: "59:39", p95: "58:03", p99: "54:52" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 367, p25: "1:11:53", p50: "1:06:11", p75: "59:55", p90: "54:59", p95: "52:35", p99: "47:41" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 197, p25: "1:13:53", p50: "1:05:42", p75: "57:46", p90: "53:03", p95: "50:08", p99: "44:36" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 381, p25: "1:16:40", p50: "1:08:43", p75: "1:01:55", p90: "57:01", p95: "53:57", p99: "48:57" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 480, p25: "1:18:18", p50: "1:10:47", p75: "1:03:16", p90: "58:34", p95: "55:54", p99: "52:30" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 325, p25: "1:21:36", p50: "1:14:52", p75: "1:08:09", p90: "1:03:31", p95: "1:00:01", p99: "56:56" },
  { division: "TRYKA PRO", gender: "Men", athletes: 52, p25: "1:13:06", p50: "1:06:01", p75: "59:11", p90: "56:33", p95: "54:40", p99: "48:48" },
  { division: "TRYKA PRO", gender: "Women", athletes: 31, p25: "1:22:13", p50: "1:16:31", p75: "1:03:07", p90: "58:58", p95: "57:00", p99: "54:46" },
  { division: "TRYKA RELAY", gender: "Men", athletes: 24, p25: "1:15:27", p50: "1:10:57", p75: "1:02:23", p90: "48:12", p95: "47:13", p99: "46:21" },
  { division: "TRYKA RELAY", gender: "Women", athletes: 22, p25: "1:27:55", p50: "1:21:13", p75: "1:17:34", p90: "1:15:04", p95: "1:12:41", p99: "52:24" },
  { division: "TRYKA RELAY", gender: "Mixed", athletes: 16, p25: "1:14:44", p50: "1:07:53", p75: "1:00:29", p90: "53:43", p95: "51:14", p99: "51:14" },
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
  { division: "TRYKA PRO DOUBLES", gender: "Men", athletes: 59, p25: "33:22", p50: "28:32", p75: "25:44", p90: "24:48", pace: "4:28 /km" },
  { division: "TRYKA PRO DOUBLES", gender: "Women", athletes: 30, p25: "34:49", p50: "32:08", p75: "29:23", p90: "25:44", pace: "5:01 /km" },
  { division: "TRYKA PRO", gender: "Men", athletes: 52, p25: "32:51", p50: "30:10", p75: "27:21", p90: "25:58", pace: "4:43 /km" },
  { division: "TRYKA PRO", gender: "Women", athletes: 31, p25: "36:53", p50: "34:44", p75: "29:05", p90: "27:33", pace: "5:26 /km" },
  { division: "TRYKA OPEN 800", gender: "Men", athletes: 479, p25: "36:07", p50: "32:51", p75: "30:04", p90: "28:09", pace: "5:08 /km" },
  { division: "TRYKA OPEN 800", gender: "Women", athletes: 325, p25: "39:04", p50: "35:26", p75: "32:39", p90: "30:21", pace: "5:32 /km" },
  { division: "TRYKA OPEN 500", gender: "Men", athletes: 197, p25: "26:29", p50: "23:26", p75: "20:50", p90: "19:06", pace: "5:52 /km" },
  { division: "TRYKA OPEN 500", gender: "Women", athletes: 381, p25: "27:45", p50: "24:52", p75: "23:04", p90: "21:07", pace: "6:13 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Men", athletes: 408, p25: "36:43", p50: "33:36", p75: "30:48", p90: "27:42", pace: "5:15 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Women", athletes: 504, p25: "39:29", p50: "36:57", p75: "34:06", p90: "31:46", pace: "5:46 /km" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", athletes: 367, p25: "38:05", p50: "35:23", p75: "31:48", p90: "29:31", pace: "5:32 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Men", athletes: 222, p25: "25:12", p50: "23:13", p75: "21:30", p90: "19:55", pace: "5:48 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Women", athletes: 1007, p25: "28:58", p50: "25:53", p75: "23:58", p90: "22:28", pace: "6:28 /km" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", athletes: 366, p25: "27:06", p50: "24:29", p75: "22:24", p90: "20:54", pace: "6:07 /km" },
];

const TRY_ZONE_ROWS: { division: string; gender: string; p50: string; p90: string }[] = [
  { division: "TRYKA PRO DOUBLES", gender: "Men", p50: "3:31", p90: "3:01" },
  { division: "TRYKA PRO DOUBLES", gender: "Women", p50: "4:02", p90: "3:23" },
  { division: "TRYKA PRO", gender: "Men", p50: "4:01", p90: "3:16" },
  { division: "TRYKA PRO", gender: "Women", p50: "4:47", p90: "3:32" },
  { division: "TRYKA DOUBLES 800", gender: "Men", p50: "4:34", p90: "3:32" },
  { division: "TRYKA DOUBLES 800", gender: "Women", p50: "4:58", p90: "3:51" },
  { division: "TRYKA DOUBLES 800", gender: "Mixed", p50: "4:47", p90: "3:31" },
  { division: "TRYKA OPEN 800", gender: "Men", p50: "5:03", p90: "3:37" },
  { division: "TRYKA OPEN 800", gender: "Women", p50: "4:51", p90: "3:47" },
  { division: "TRYKA DOUBLES 500", gender: "Men", p50: "5:26", p90: "3:52" },
  { division: "TRYKA DOUBLES 500", gender: "Women", p50: "5:40", p90: "4:18" },
  { division: "TRYKA DOUBLES 500", gender: "Mixed", p50: "5:36", p90: "4:06" },
  { division: "TRYKA OPEN 500", gender: "Men", p50: "5:55", p90: "3:59" },
  { division: "TRYKA OPEN 500", gender: "Women", p50: "5:54", p90: "4:08" },
  { division: "TRYKA RELAY", gender: "Men", p50: "4:15", p90: "2:52" },
  { division: "TRYKA RELAY", gender: "Women", p50: "5:22", p90: "4:40" },
  { division: "TRYKA RELAY", gender: "Mixed", p50: "4:15", p90: "2:57" },
];

// Median seconds per (division, station, gender). Stations ordered by the typical course order.
const STATION_DATA_BY_DIVISION: StationsByDivision[] = [
  {
    division: "Open 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 270 }, { gender: "Women", sec: 310 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 101 }, { gender: "Women", sec: 105 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 248 }, { gender: "Women", sec: 225 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 171 }, { gender: "Women", sec: 144 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 234 }, { gender: "Women", sec: 265 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 299 }, { gender: "Women", sec: 331 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 292 }, { gender: "Women", sec: 274 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 297 }, { gender: "Women", sec: 363 }] },
    ],
  },
  {
    division: "Open 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 275 }, { gender: "Women", sec: 321 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 109 }, { gender: "Women", sec: 111 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 278 }, { gender: "Women", sec: 245 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 182 }, { gender: "Women", sec: 153 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 257 }, { gender: "Women", sec: 298 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 309 }, { gender: "Women", sec: 348 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 335 }, { gender: "Women", sec: 314 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 368 }, { gender: "Women", sec: 428 }] },
    ],
  },
  {
    division: "Doubles 800",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 238 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 254 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 85 }, { gender: "Women", sec: 93 }, { gender: "Mixed", sec: 89 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 172 }, { gender: "Women", sec: 180 }, { gender: "Mixed", sec: 185 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 99 }, { gender: "Women", sec: 93 }, { gender: "Mixed", sec: 110 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 164 }, { gender: "Women", sec: 205 }, { gender: "Mixed", sec: 191 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 275 }, { gender: "Women", sec: 315 }, { gender: "Mixed", sec: 290 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 191 }, { gender: "Women", sec: 195 }, { gender: "Mixed", sec: 205 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 190 }, { gender: "Women", sec: 248 }, { gender: "Mixed", sec: 206 }] },
    ],
  },
  {
    division: "Doubles 500",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 243 }, { gender: "Women", sec: 291 }, { gender: "Mixed", sec: 258 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 91 }, { gender: "Women", sec: 102 }, { gender: "Mixed", sec: 99 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 183 }, { gender: "Women", sec: 189 }, { gender: "Mixed", sec: 201 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 102 }, { gender: "Women", sec: 98 }, { gender: "Mixed", sec: 115 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 178 }, { gender: "Women", sec: 220 }, { gender: "Mixed", sec: 204 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 290 }, { gender: "Women", sec: 326 }, { gender: "Mixed", sec: 303 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 206 }, { gender: "Women", sec: 221 }, { gender: "Mixed", sec: 232 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 210 }, { gender: "Women", sec: 283 }, { gender: "Mixed", sec: 242 }] },
    ],
  },
  {
    division: "Pro Doubles",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 225 }, { gender: "Women", sec: 263 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 86 }, { gender: "Women", sec: 99 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 173 }, { gender: "Women", sec: 206 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 115 }, { gender: "Women", sec: 124 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 199 }, { gender: "Women", sec: 196 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 254 }, { gender: "Women", sec: 293 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 184 }, { gender: "Women", sec: 198 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 143 }, { gender: "Women", sec: 181 }] },
    ],
  },
  {
    division: "Pro",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 255 }, { gender: "Women", sec: 296 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 93 }, { gender: "Women", sec: 120 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 273 }, { gender: "Women", sec: 299 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 211 }, { gender: "Women", sec: 202 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 269 }, { gender: "Women", sec: 263 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 275 }, { gender: "Women", sec: 319 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 284 }, { gender: "Women", sec: 272 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 205 }, { gender: "Women", sec: 272 }] },
    ],
  },
  {
    division: "Relay",
    data: [
      { station: "SkiErg", rows: [{ gender: "Men", sec: 289 }, { gender: "Women", sec: 332 }, { gender: "Mixed", sec: 322 }] },
      { station: "KB Farmers Carry", rows: [{ gender: "Men", sec: 108 }, { gender: "Women", sec: 116 }, { gender: "Mixed", sec: 113 }] },
      { station: "Ramfit Thrusters", rows: [{ gender: "Men", sec: 205 }, { gender: "Women", sec: 228 }, { gender: "Mixed", sec: 226 }] },
      { station: "Sled Push", rows: [{ gender: "Men", sec: 136 }, { gender: "Women", sec: 140 }, { gender: "Mixed", sec: 148 }] },
      { station: "Sled Pull", rows: [{ gender: "Men", sec: 234 }, { gender: "Women", sec: 306 }, { gender: "Mixed", sec: 217 }] },
      { station: "Rowing", rows: [{ gender: "Men", sec: 299 }, { gender: "Women", sec: 357 }, { gender: "Mixed", sec: 290 }] },
      { station: "Lunges", rows: [{ gender: "Men", sec: 260 }, { gender: "Women", sec: 305 }, { gender: "Mixed", sec: 293 }] },
      { station: "Burpees", rows: [{ gender: "Men", sec: 300 }, { gender: "Women", sec: 439 }, { gender: "Mixed", sec: 263 }] },
    ],
  },
];

const STATION_FASTEST: {
  station: string;
  time: string;
  name: string;
  division: string;
}[] = [
  { station: "SkiErg", time: "3:00", name: "Catherine Byrne / Alison Nulty", division: "DOUBLES 800 Women" },
  { station: "KB Farmers Carry", time: "0:58", name: "Patrick O'Connor", division: "OPEN 800 Men" },
  { station: "Ramfit Thrusters", time: "1:36", name: "Tom Cullen / Noni Cullen", division: "DOUBLES 800 Mixed" },
  { station: "Sled Push", time: "0:53", name: "Mairead Finucane / Noelle Casey", division: "DOUBLES 800 Women" },
  { station: "Sled Pull", time: "1:42", name: "Karl Gobl / Alan Roche", division: "DOUBLES 800 Men" },
  { station: "Rowing", time: "3:02", name: "Marta Kucinska / Sophia Eracleous", division: "DOUBLES 500 Women" },
  { station: "Lunges", time: "1:51", name: "Josh Flynn / Paul O'Brien", division: "DOUBLES 800 Men" },
  { station: "Burpees", time: "1:31", name: "David Lavery / Ciaran Nash", division: "PRO DOUBLES Men" },
];

const SPRINT = { fastest: "0:07", median: "0:12", p90: "0:16" };

const RUN_FADE: { division: string; r1: string; r8: string; delta: number }[] = [
  { division: "PRO DOUBLES Men", r1: "2:44", r8: "3:30", delta: 46 },
  { division: "DOUBLES 500 Women", r1: "2:23", r8: "3:10", delta: 47 },
  { division: "DOUBLES 500 Mixed", r1: "2:10", r8: "3:02", delta: 52 },
  { division: "DOUBLES 500 Men", r1: "2:01", r8: "2:55", delta: 54 },
  { division: "DOUBLES 800 Mixed", r1: "3:27", r8: "4:24", delta: 57 },
  { division: "DOUBLES 800 Men", r1: "3:14", r8: "4:12", delta: 58 },
  { division: "OPEN 500 Women", r1: "2:11", r8: "3:09", delta: 58 },
  { division: "OPEN 800 Women", r1: "3:29", r8: "4:29", delta: 60 },
  { division: "PRO Men", r1: "2:45", r8: "3:47", delta: 62 },
  { division: "PRO Women", r1: "3:09", r8: "4:19", delta: 70 },
  { division: "OPEN 800 Men", r1: "3:05", r8: "4:16", delta: 71 },
  { division: "OPEN 500 Men", r1: "1:51", r8: "3:05", delta: 74 },
];

export default function DublinSpringRace3Report() {
  return (
    <div className="space-y-10">
      <p className="text-sm leading-relaxed text-slate-300">
        Dublin Spring Race 3 drew 4,495 athletes — the biggest field of the Tryka calendar so far.
        The day belonged to the doubles teams, who accounted for nearly two thirds of the start list
        and produced the day's fastest single-station times. Josh Flynn and Paul O'Brien won
        Doubles 800 and went on to set the fastest Lunges and Burpees splits of the entire race.
      </p>

      <CalloutStrip />

      <Section title="TL;DR">
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            Doubles 500 was the day's biggest field at 1,597 athletes — 35% of the race and
            nearly double Open 800 (805).
          </li>
          <li>
            Pro Doubles Men were the fastest runners of the day at a 4:28/km median pace,
            undercutting individual Pro Men (4:43/km) and Open 800 Men (5:08/km).
          </li>
          <li>
            Burpees was where the field separated: Pro Doubles Men's 2:23 median was three times
            faster than Open 500 Women's 7:08.
          </li>
          <li>
            Josh Flynn and Paul O'Brien won Doubles 800 outright in 45:07 and posted the fastest
            single-team times on both Lunges (1:51) and Burpees — a clean sweep on the metcon
            stations.
          </li>
          <li>
            Pro Doubles Men held pace best across the eight running laps: only 46 seconds of fade
            between Running 1 and Running 8, vs 71–74 seconds in Open 800 Men and Open 500 Men.
          </li>
        </ul>
      </Section>

      <Section title="Race overview">
        <p className="mb-4 text-sm text-slate-300">
          4,495 athletes raced across seven divisions. Women outnumbered men 2,302 to 1,444; mixed
          teams added another 749. The largest age bands were 30–39 (1,134), 40–49 (1,066) and
          20–29 (557).
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
          elite: the 99th column is the time achieved by the top 1% of each field; the 25th column
          is what you'd see in the bottom quartile. Groups with fewer than five athletes are
          excluded.
        </p>
        <PercentileTable rows={OVERALL_PERCENTILES} />
      </Section>

      <Section title="Running — Runs 1 through 8 combined">
        <p className="mb-4 text-sm text-slate-300">
          The eight running laps add up to between 4 km (the 500 formats) and 6.4 km (the 800
          formats, Pro and Relay). Pro Doubles Men ran the day's fastest median pace at 4:28/km;
          Open 800 Men, the largest individual field, sat at 5:08/km.
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
          The TRY Zone is the back half of the workout. Pro Doubles Men cleared it in a median
          3:31 — 90 seconds clear of the largest division (Doubles 800 Men, 4:34). At the other
          end, Open 500 Men's 5:55 median was the slowest of any large group.
        </p>
        <TryZoneTable rows={TRY_ZONE_ROWS} />
      </Section>

      <Section title="Workout stations — gender gap by division">
        <p className="mb-6 text-sm text-slate-300">
          Median time on each of the eight workout stations. Pick a division below; bars are
          grouped by gender within each station, and the chart scales to that division. The most
          interesting feature is which stations flip the gender order: women were faster than men
          on Ramfit Thrusters, Lunges and Sled Push in every individual Open division — switch
          between Open 500 and Open 800 to see the pattern hold.
        </p>

        <StationPicker divisions={STATION_DATA_BY_DIVISION} />

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
          The Running Finish Sprint clocks the last few metres into the line. Median was 12 seconds;
          90% of athletes were under 16. The fastest finisher hit the mat in 7 seconds — somebody
          who'd saved more than they thought they had.
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
            The Tryka format rewards teamwork on the metcons. Pro Doubles Men were faster than
            individual Pro Men on Burpees by over a minute, on Lunges by 100 seconds, and on Sled
            Push despite carrying the heavier doubles sled.
          </li>
          <li>
            Lunges and Thrusters are where the standards flip: women were faster than men in
            individual Open 500 and Open 800 on both stations. Sled Push too — Open 500 Women
            beat Open 500 Men by 29 seconds on the median push.
          </li>
          <li>
            Pacing held best among elite doubles and decayed worst in Open Men's fields. Open 500
            Men slowed by 74 seconds between Run 1 and Run 8 — Pro Doubles Men lost only 46.
          </li>
          <li>
            Pro and Doubles 800 Men's 99th-percentile finishes (48:48 and 46:04) were inside a
            three-minute window, even though Pro is the individual format and Doubles 800 is a team.
            The race's top end is more about format choice than raw talent.
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
    { label: "Athletes", value: "4,495" },
    { label: "Largest field", value: "1,597" },
    { label: "Fastest finish", value: "40:59" },
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

