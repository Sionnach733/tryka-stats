export type StationContent = {
  slug: string;
  name: string;
  tips: string[];
  tipsTable?: { headers: string[]; rows: string[][] };
  standardsIndividual: string[];
  standardsDoubles: string[];
};

export const STATIONS: StationContent[] = [
  {
    slug: "ski-erg",
    name: "SkiErg",
    tips: [
      "Set your damper before the judge resets the monitor — you can change it during the effort too.",
      "Use a double-pole rhythm: hinge at the hips and drive the handles down past your thighs, not just your waist.",
      "Keep your feet shoulder-width apart and stay on the platform — stepping off is a penalty.",
      "Raise your arm clearly and wait for judge confirmation before unclipping — leaving early is a time penalty.",
    ],
    standardsIndividual: [
      "The machine monitor will be set to zero by the judge before use.",
      "The damper can be changed as many times as required by the working athlete.",
      "Athletes are not permitted to touch the screen on the Ski-Erg; doing so will result in a time penalty.",
      "Athletes must remain on the platform at all times during the exercise.",
      "Once the 1,000m distance is completed, the athlete must raise their arm to call over a judge to confirm completion.",
      "Only after the judge confirms the distance has been completed may the athlete leave.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change as many times as they wish (IGYG) to complete 1,000m; handles cannot be transferred between partners.",
      "The non-working athlete must stand in a designated marked area; penalties apply for non-compliance.",
    ],
  },
  {
    slug: "kb-farmers-carry",
    name: "KB Farmers Carry",
    tips: [
      "Collect the correct kettlebells for your division before entering your lane — using the wrong weight is an instant DQ.",
      "Keep your arms fully extended at your sides with handles outside your thighs at all times.",
      "Short, quick steps help maintain posture and reduce the chance of the bells clashing against your legs.",
      "If you need to rest, set both bells down — you cannot rest them on your thighs or body.",
      "Cross the finish line with both kettlebells in hand, then carry them back neatly to the storage area.",
    ],
    standardsIndividual: [
      "Athletes must take the correct weights for their division from the kettlebell storage area; selecting incorrect weights will result in disqualification (DQ).",
      "Kettlebells must be carried at the sides with both arms fully extended.",
      "Both kettlebells must be carried at all times; handles must remain outside the thighs.",
      "Kettlebells may be dropped at any time; resting is permitted with kettlebells in hand or placed on the ground.",
      "The station is complete when the athlete crosses the finish line with both kettlebells.",
      "Kettlebells must be returned neatly to the storage area; penalties apply for non-compliance.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired to complete the 200m distance (IGYG).",
      "The non-working athlete must be behind the working athlete at all times; penalties apply for non-compliance.",
      "When changing over, the kettlebells must be placed on the ground; the trailing partner then picks them up.",
    ],
  },
  {
    slug: "ramfit-thrusters",
    name: "Ramfit Thrusters",
    tips: [
      "Press the Start button on the AI judging screen before your first rep — unrepped sets won't count.",
      "Squat to at least parallel (below parallel for Pro division) and lock out fully overhead on every rep.",
      "Break the 60 reps into manageable sets — the RAM can be placed on the ground at any time.",
      "Pace yourself: 6 sets of 10 with short rests is often faster than grinding through fatigue.",
      "Return the RAM neatly to the rack before leaving — judges are watching.",
    ],
    standardsIndividual: [
      "This station uses AI-assisted judging. The athlete must press Start on the screen when arriving at their designated lane before beginning; failing to press Start will result in reps not being counted.",
      "A full squat to parallel is required for all divisions except Pro, where below parallel is required.",
      "A full extension overhead at the top is required for every rep.",
      "The RAM may be placed on the ground at any time during the set.",
      "Athletes must complete 60 reps and return the RAM neatly; penalties apply for rule violations.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "The RAM can be handed between partners during a changeover.",
      "Athletes may change over as many times as desired to complete 60 reps (IGYG).",
      "The non-working athlete must stand in a designated marked area; penalties apply for non-compliance.",
    ],
  },
  {
    slug: "sled-push",
    name: "Sled Push",
    tips: [
      "Start with your hips low and body at a steep forward angle — power comes from leg drive, not the upper body.",
      "Push the sled completely over the 12.5m turnaround line before reversing direction; short-turning is penalised.",
      "Stay strictly in your lane — a 1-minute penalty applies for lane violations.",
      "Drive with short, powerful steps and keep continuous contact with the sled handles.",
    ],
    standardsIndividual: [
      "The athlete and sled must start behind the start line.",
      "The push must come from behind the sled.",
      "The sled must be pushed all the way over the line at the 12.5m mark before changing direction.",
      "Athletes must stay within their designated lane; a 1-minute penalty applies for lane violations.",
      "The entire sled must cross the finish line to complete the station.",
      "A 3-minute penalty per length applies if fewer than 4 lengths are completed.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired (IGYG).",
      "The non-working athlete must walk directly behind the working partner during the push; penalties apply for non-compliance.",
    ],
  },
  {
    slug: "sled-pull",
    name: "Sled Pull",
    tips: [
      "Stay planted in your 1m box — you cannot step on any of the 4 lines of the box.",
      "Pull hand-over-hand in a smooth, continuous rhythm; jerky pulls waste energy.",
      "Keep the rope in your lane at all times — rope violations carry penalties.",
      "Stay standing throughout; sitting or kneeling is not permitted.",
      "When changing over with your doubles partner, place the rope on the ground — your partner must pick it up themselves.",
    ],
    standardsIndividual: [
      "The athlete must start inside their 1m box and pull the sled towards them.",
      "The athlete must stay inside the 1m box at all times and cannot step on any of the 4 lines of the box; penalties apply.",
      "The athlete must pull with both hands using a hand-over-hand technique.",
      "The athlete must remain standing at all times.",
      "The entire sled must cross the finish line to complete the station.",
      "The rope must be kept in your lane at all times; penalties apply for violations.",
      "A 3-minute penalty per length applies if fewer than 4 lengths are completed.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired (IGYG), but must stay within their designated lines, lanes, and box.",
      "The non-working partner must be on the same side of the station as the working athlete and stand outside the box.",
      "The non-working athlete cannot touch the rope; changeover is done from the rope on the ground.",
    ],
  },
  {
    slug: "rowing",
    name: "Rowing",
    tips: [
      "Secure your feet in the straps completely before picking up the handle — feet not strapped in before grabbing the handle is a penalty.",
      "Drive with your legs first, then lean back, then pull the handle to your lower chest.",
      "Set your damper before the judge resets the monitor.",
      "Do not touch the monitor screen — this is a time penalty.",
      "Raise your arm clearly when done and wait for judge confirmation before leaving the machine.",
    ],
    standardsIndividual: [
      "Athletes must complete 1,000m on a Concept2 Rower.",
      "The machine monitor will be reset to zero by the judge before use.",
      "The athlete's feet must be secured in the straps before grabbing the handle.",
      "The damper can be changed as many times as required by the working athlete.",
      "Athletes are not permitted to touch the screen on the Rower; doing so will result in a time penalty.",
      "Once the 1,000m distance is completed, the athlete must raise their arm to call over a judge to confirm completion.",
      "Only after the judge confirms the distance has been completed may the athlete leave.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired (IGYG).",
      "When changing over, the working partner must remove their feet from the straps and release the handle before the changeover can occur.",
      "The non-working partner may not assist with releasing the feet from the straps; infringement will incur a penalty.",
      "The non-working athlete must stand in a designated marked area; penalties apply for non-compliance.",
    ],
  },
  {
    slug: "lunges",
    name: "Lunges",
    tips: [
      "Load the RAM onto your upper back without assistance before entering the course.",
      "Drive your trailing knee all the way to the ground on every rep — partial contact is a no-rep.",
      "Stand fully upright between reps; hunching forward shifts weight onto the RAM and leads to drops.",
      "Take deliberate steps with no shuffles or extra foot movements between lunges.",
      "If you need to stop, hold both feet parallel on the ground — do not rest with one knee down.",
      "If you drop the RAM, a 1-minute penalty (singles) or 2-minute penalty (doubles) is issued immediately with no prior warning.",
    ],
    standardsIndividual: [
      "The athlete must lift and place the RAM on the back of their shoulders without assistance.",
      "The RAM must remain on the upper back at all times and may not be dropped.",
      "The RAM cannot touch the ground until 100m is completed; penalties apply.",
      "Lunges must alternate and the trailing knee must touch the ground on each rep.",
      "Upright walking, shuffles, or extra steps between lunges are not allowed; time penalties apply.",
      "The athlete may lunge continuously or stop after each lunge with both feet parallel on the ground.",
      "The athlete must stand upright on each repetition.",
      "Athletes not adhering to standards will receive one warning; subsequent infringements incur a 1-minute penalty for singles. If the RAM touches the floor, a 1-minute penalty is immediately issued per instance without prior warning.",
      "The RAM must be returned correctly to the designated zone; penalties apply for non-compliance.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired (IGYG).",
      "When changing over, the RAM must be handed backwards (not forwards); penalties apply for non-compliance.",
      "The non-working partner must stay behind the working partner at all times; penalties apply for non-compliance.",
      "Infringements incur a 2-minute penalty for doubles; if the RAM touches the floor a 2-minute penalty is immediately issued per instance without prior warning.",
    ],
  },
  {
    slug: "burpees",
    name: "Burpees",
    tips: [
      "Use the full 50 cm hand-placement allowance: you can place your hands up to 50 cm in front of your feet when dropping into the burpee — maximising this gives you a longer, more powerful takeoff position.",
      "Tryka allows 50 cm; Hyrox only allows 30 cm. If you train for Hyrox events, consciously practise pushing that extra 20 cm in Tryka races."
    ],
    tipsTable: {
      headers: ["Hand placement", "Jump distance", "Reps to cover 80 m"],
      rows: [
        ["Hyrox-style (30 cm)", "~1.5 m", "54 reps"],
        ["Full allowance (50 cm)", "~1.7 m", "48 reps"],
        ["Saving", "", "6 fewer reps"],
      ],
    },
    standardsIndividual: [
      "Hands must be behind the start line and chest must touch the floor for each burpee.",
      "When jumping or stepping out of any burpee, the feet cannot go beyond the athlete's fingertips.",
      "Feet must be parallel at takeoff.",
      "The athlete makes a forward jump; the landing must be controlled with both feet parallel.",
      "A 50cm distance is allowed between hands and feet when dropping into the burpee.",
      "The length of each jump is at the athlete's discretion.",
      "An athlete must not shuffle forward or take extra steps; penalties apply for non-compliance.",
      "Athletes must complete 80m and jump from a burpee over the finish line.",
      "Athletes not adhering to standards will receive one warning; a 1-minute time penalty is then issued for continued non-compliance.",
    ],
    standardsDoubles: [
      "Both athletes must be present before the exercise can commence.",
      "Athletes may change over as many times as desired (IGYG).",
      "The non-working athlete must stay behind the working partner at all times; penalties apply for non-compliance.",
      "Athletes not adhering to standards will receive one warning; a 2-minute penalty is issued for continued non-compliance.",
    ],
  },
];

export function getStationBySlug(slug: string): StationContent | undefined {
  return STATIONS.find((s) => s.slug === slug);
}
