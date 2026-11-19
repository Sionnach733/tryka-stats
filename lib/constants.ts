export const WORKOUT_STATIONS = [
  "SkiErg",
  "KB Farmers Carry",
  "Ramfit Thrusters",
  "Sled Push",
  "Sled Pull",
  "Rowing",
  "Lunges",
  "Burpees",
];

// Splits faster than this are treated as data errors and ignored when picking
// an athlete's best station time. Keep keys in sync with WORKOUT_STATIONS.
export const STATION_MIN_SECONDS: Record<string, number> = {
  SkiErg: 120,
  "KB Farmers Carry": 20,
  "Ramfit Thrusters": 70,
  "Sled Push": 30,
  "Sled Pull": 40,
  Rowing: 100,
  Lunges: 30,
  Burpees: 50,
};

export const PACE_DISTANCES: Record<string, number> = {
  "TRYKA OPEN 800": 6.4,
  "TRYKA DOUBLES 800": 6.4,
  "TRYKA RELAY": 6.4,
  "TRYKA PRO": 6.4,
  "TRYKA PRO DOUBLES": 6.4,
  "TRYKA DOUBLES PRO": 6.4,
  "TRYKA OPEN 500": 4,
  "TRYKA DOUBLES 500": 4,
};

export const RUN_SPLITS = [
  "Running 1",
  "Running 2",
  "Running 3",
  "Running 4",
  "Running 5",
  "Running 6",
  "Running 7",
  "Running 8",
  "TRY Zone Total",
];
