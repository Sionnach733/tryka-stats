export type StationContent = {
  slug: string;
  name: string;
  tagline: string;
  tips: string[];
  standardsIndividual: string[];
  standardsDoubles: string[];
};

const PLACEHOLDER_TIP = "Tips & tricks coming soon — check back once we've published this guide.";
const PLACEHOLDER_STD = "Movement standards will be transcribed from the official Tryka rulebook (link coming soon).";

export const STATIONS: StationContent[] = [
  {
    slug: "ski-erg",
    name: "SkiErg",
    tagline: "Drive through the hips, finish at the thighs.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "kb-farmers-carry",
    name: "KB Farmers Carry",
    tagline: "Tight grip, tall posture, short fast steps.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "ramfit-thrusters",
    name: "Ramfit Thrusters",
    tagline: "Full squat, full lockout — every rep counts.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "sled-push",
    name: "Sled Push",
    tagline: "Low body angle, drive through the toes.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "sled-pull",
    name: "Sled Pull",
    tagline: "Hand-over-hand, stay grounded, control the rope.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "rowing",
    name: "Rowing",
    tagline: "Legs, back, arms — in that order, every stroke.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "lunges",
    name: "Lunges",
    tagline: "Back knee touches, front heel stays planted.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
  {
    slug: "burpees",
    name: "Burpees",
    tagline: "Chest to floor, full extension, repeat.",
    tips: [PLACEHOLDER_TIP],
    standardsIndividual: [PLACEHOLDER_STD],
    standardsDoubles: [PLACEHOLDER_STD],
  },
];

export function getStationBySlug(slug: string): StationContent | undefined {
  return STATIONS.find((s) => s.slug === slug);
}
