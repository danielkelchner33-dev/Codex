// ============================================================
// StagParty.io — Activity Curator Agent
// Curates bachelor party activities matched to group vibe
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { generateId } from "@/utils/helpers";
import type { ItineraryEvent, EventType } from "@/models/types";

// ── Input / Output Types ────────────────────────────────────

export interface ActivityCuratorInput {
  destination: string;
  vibe: string;
  groupSize: number;
  budget: number;
  duration: number; // days
}

export interface CuratedActivity {
  name: string;
  description: string;
  costPerPerson: number;
  duration: string;
  bookingInfo: string;
  vibeMatch: string;
  groupSizeMin: number;
  groupSizeMax: number;
  category: "adventure" | "water" | "food_drink" | "chill" | "nightlife" | "bonding";
  bestTimeOfDay: "morning" | "afternoon" | "evening" | "any";
  reservationRequired: boolean;
  insiderTip?: string;
}

export interface ActivityCuratorOutput {
  activities: CuratedActivity[];
  dayPlan: string;
  budgetSummary: {
    totalPerPerson: number;
    breakdown: string;
  };
}

// ── Built-in Catalina Activities ────────────────────────────

const CATALINA_ACTIVITIES: CuratedActivity[] = [
  {
    name: "Trans-Catalina Trail Hike",
    description:
      "Hike a section of the famous 38.5-mile trail through rugged island terrain. The Avalon to Hermit Gulch section offers stunning ocean views and takes about 2-3 hours for a moderate group. Spot bison along the way.",
    costPerPerson: 0,
    duration: "2-3 hours",
    bookingInfo:
      "Free — no reservation needed. Get a free hiking permit at the Catalina Conservancy office in Avalon.",
    vibeMatch: "Adventure, outdoors, morning energy burner",
    groupSizeMin: 2,
    groupSizeMax: 30,
    category: "adventure",
    bestTimeOfDay: "morning",
    reservationRequired: false,
    insiderTip:
      "Start early before it gets hot. Bring more water than you think — there are no refill spots on the trail.",
  },
  {
    name: "Snorkeling at Lovers Cove",
    description:
      "Crystal-clear waters with abundant marine life right in Avalon. Rent gear from a local shop and snorkel the protected cove. Expect to see garibaldi, bat rays, and kelp forests.",
    costPerPerson: 25,
    duration: "1.5-2 hours",
    bookingInfo:
      "Gear rental from Descanso Beach Ocean Sports or Catalina Snorkel & Scuba. Walk-ins welcome but reserve for groups of 10+.",
    vibeMatch: "Chill adventure, easy activity for all skill levels",
    groupSizeMin: 1,
    groupSizeMax: 20,
    category: "water",
    bestTimeOfDay: "morning",
    reservationRequired: false,
    insiderTip:
      "Go in the morning when the water is calmest and clearest. The garibaldi are most active in the shallows.",
  },
  {
    name: "Kayaking to Two Harbors",
    description:
      "Paddle along Catalina's rugged coastline from Descanso Beach toward Two Harbors. Guided tours available for groups. Pass sea caves, kelp forests, and hidden coves.",
    costPerPerson: 45,
    duration: "3-4 hours",
    bookingInfo:
      "Descanso Beach Ocean Sports — guided tours available for groups. Book 1 week ahead for weekends.",
    vibeMatch: "Active adventure, competitive group activity",
    groupSizeMin: 4,
    groupSizeMax: 16,
    category: "water",
    bestTimeOfDay: "morning",
    reservationRequired: true,
    insiderTip:
      "The guided tour is worth it — they know the best sea caves and hidden beaches. Bring a dry bag for phones.",
  },
  {
    name: "Deep-Sea Fishing Charter",
    description:
      "Charter a fishing boat out of Avalon harbor for half-day or full-day trips. Target yellowtail, calico bass, and bonito. Most charters include gear and bait. Perfect competitive group activity.",
    costPerPerson: 75,
    duration: "4-6 hours",
    bookingInfo:
      "Afishinados Charters or Catalina Island Fishing — book at least 2 weeks ahead for groups. Half-day charters fit bachelor party energy levels better.",
    vibeMatch: "Classic bachelor party activity, competitive, relaxed",
    groupSizeMin: 4,
    groupSizeMax: 12,
    category: "adventure",
    bestTimeOfDay: "morning",
    reservationRequired: true,
    insiderTip:
      "Half-day morning charter is the sweet spot — back in time for lunch and afternoon activities. Bring your own beer.",
  },
  {
    name: "Harbor BBQ Cookout",
    description:
      "Rent a BBQ area at the harbor or Descanso Beach Club for a group cookout. Grab supplies from Vons Market in Avalon. Grill burgers, steaks, and seafood while overlooking the harbor.",
    costPerPerson: 30,
    duration: "2-3 hours",
    bookingInfo:
      "Descanso Beach Club BBQ area — reserve in advance. Alternatively, use the public BBQ pits at the Hermit Gulch campground (first come, first served).",
    vibeMatch: "Group bonding, chill vibes, sunset activity",
    groupSizeMin: 6,
    groupSizeMax: 30,
    category: "food_drink",
    bestTimeOfDay: "evening",
    reservationRequired: true,
    insiderTip:
      "Buy meat and supplies on the mainland — island prices are 2x. Bring a portable speaker and cornhole for the full experience.",
  },
  {
    name: "Avalon Bar Crawl",
    description:
      "Hit the handful of bars along Avalon's waterfront. Start at Luau Larry's for tropical cocktails, move to The Marlin Club (oldest bar on the island), and end at Descanso Beach Club for sunset drinks in the sand.",
    costPerPerson: 50,
    duration: "3-4 hours",
    bookingInfo:
      "No reservation needed — Avalon is small enough to walk everything. Descanso Beach Club charges a small cover on weekends.",
    vibeMatch: "Classic bachelor party, nightlife, group fun",
    groupSizeMin: 4,
    groupSizeMax: 25,
    category: "nightlife",
    bestTimeOfDay: "evening",
    reservationRequired: false,
    insiderTip:
      "Luau Larry's does a signature drink in a souvenir cup — buy one for the groom. The Marlin Club has pool tables and a dive bar feel the boys will love.",
  },
  {
    name: "Zip-Line Eco Tour",
    description:
      "Soar over Descanso Canyon on a series of 5 zip lines. The course covers 3,671 feet of cable with views of the harbor, ocean, and island interior. Guides share island ecology along the way.",
    costPerPerson: 110,
    duration: "2 hours",
    bookingInfo:
      "Catalina Zip Line Eco Tour — catalinaislandzip.com. Book at least 1 week in advance. Max 12 per tour group.",
    vibeMatch: "Adrenaline rush, adventure, great photo ops",
    groupSizeMin: 2,
    groupSizeMax: 12,
    category: "adventure",
    bestTimeOfDay: "afternoon",
    reservationRequired: true,
    insiderTip:
      "Go after lunch when the wind picks up slightly — faster and more thrilling. GoPro mounts available for rent.",
  },
  {
    name: "Golf Cart Island Tour",
    description:
      "Rent golf carts (the main transport on Catalina) and cruise around Avalon and the surrounding hills. Self-guided tour takes you past scenic viewpoints, the botanical garden, and the iconic Casino building.",
    costPerPerson: 25,
    duration: "1.5-2 hours",
    bookingInfo:
      "Island Rentals on Crescent Ave — first come, first served but reserve for groups of 6+ carts. 2-person and 6-person carts available.",
    vibeMatch: "Fun group transport, scenic, laid-back",
    groupSizeMin: 2,
    groupSizeMax: 30,
    category: "chill",
    bestTimeOfDay: "afternoon",
    reservationRequired: false,
    insiderTip:
      "The 6-person carts are worth the premium — keep the crew together. Drive up to the Wrigley Memorial for the best view on the island.",
  },
];

// ── Tool Schema ─────────────────────────────────────────────

const ACTIVITY_TOOL: Anthropic.Messages.Tool = {
  name: "submit_activities",
  description: "Submit curated activity recommendations for the bachelor party.",
  input_schema: {
    type: "object" as const,
    properties: {
      activities: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            costPerPerson: { type: "number" },
            duration: { type: "string" },
            bookingInfo: { type: "string" },
            vibeMatch: { type: "string" },
            groupSizeMin: { type: "number" },
            groupSizeMax: { type: "number" },
            category: {
              type: "string",
              enum: ["adventure", "water", "food_drink", "chill", "nightlife", "bonding"],
            },
            bestTimeOfDay: {
              type: "string",
              enum: ["morning", "afternoon", "evening", "any"],
            },
            reservationRequired: { type: "boolean" },
            insiderTip: { type: "string" },
          },
          required: [
            "name",
            "description",
            "costPerPerson",
            "duration",
            "bookingInfo",
            "vibeMatch",
            "groupSizeMin",
            "groupSizeMax",
            "category",
            "bestTimeOfDay",
            "reservationRequired",
          ],
        },
      },
      dayPlan: {
        type: "string",
        description:
          "Suggested order of activities across the trip days, considering energy and logistics",
      },
      budgetSummary: {
        type: "object",
        properties: {
          totalPerPerson: { type: "number" },
          breakdown: { type: "string" },
        },
        required: ["totalPerPerson", "breakdown"],
      },
    },
    required: ["activities", "dayPlan", "budgetSummary"],
  },
};

// ── Main Curator Function ───────────────────────────────────

export async function curateActivities(
  input: ActivityCuratorInput,
): Promise<ActivityCuratorOutput> {
  const client = new Anthropic();

  const isCatalina =
    input.destination.toLowerCase().includes("catalina") ||
    input.destination.toLowerCase().includes("avalon");

  const systemPrompt = `You are StagParty's Activity Curator Agent. You curate the ultimate bachelor party activity lineup.

Your task: Recommend 8-12 activities that match the group's vibe, size, and budget for their destination.

For each activity include:
- Name and detailed description
- Cost per person
- Duration
- Booking info (how and when to book)
- Which vibe it matches
- Group size limits
- Category (adventure, water, food_drink, chill, nightlife, bonding)
- Best time of day
- Whether reservation is required
- An insider tip

Also provide a suggested day plan ordering and a budget summary.

${isCatalina ? `VERIFIED CATALINA ACTIVITIES — use these as your primary source and enhance with additional details:\n${JSON.stringify(CATALINA_ACTIVITIES, null, 2)}` : ""}

Balance the lineup:
- Mix high-energy and low-energy activities
- Include food/drink experiences
- Add at least one "only here" unique experience
- Consider weather and seasonal availability
- Factor in group size constraints

Use the submit_activities tool to provide your structured response.`;

  const userMessage = `Curate bachelor party activities for this group:

- Destination: ${input.destination}
- Vibe: ${input.vibe}
- Group Size: ${input.groupSize} people
- Activity Budget: $${input.budget} per person
- Trip Duration: ${input.duration} days

Find the best mix of activities. Use the tool to submit your curated list.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [ACTIVITY_TOOL],
    tool_choice: { type: "tool", name: "submit_activities" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use",
  );

  if (toolUseBlock && toolUseBlock.type === "tool_use") {
    return toolUseBlock.input as ActivityCuratorOutput;
  }

  // Fallback for Catalina
  const fittingActivities = CATALINA_ACTIVITIES.filter(
    (a) => a.groupSizeMax >= input.groupSize && a.costPerPerson <= input.budget,
  );

  return {
    activities: fittingActivities.length > 0 ? fittingActivities : CATALINA_ACTIVITIES,
    dayPlan:
      "Day 1: Morning hike + afternoon snorkeling + evening bar crawl. Day 2: Morning fishing charter + afternoon golf carts + evening harbor BBQ.",
    budgetSummary: {
      totalPerPerson: fittingActivities.reduce((sum, a) => sum + a.costPerPerson, 0),
      breakdown: "Activities only — does not include transport or accommodation.",
    },
  };
}

// ── Convert to Itinerary Events ─────────────────────────────

export function toItineraryEvents(activities: CuratedActivity[]): ItineraryEvent[] {
  const timeSlots: Record<string, string> = {
    morning: "09:00",
    afternoon: "14:00",
    evening: "19:00",
    any: "12:00",
  };

  const categoryToEventType: Record<string, EventType> = {
    adventure: "activity",
    water: "activity",
    food_drink: "meal",
    chill: "free_time",
    nightlife: "drinks",
    bonding: "activity",
  };

  return activities.map((activity) => ({
    id: generateId("evt"),
    time: timeSlots[activity.bestTimeOfDay] || "12:00",
    title: activity.name,
    description: activity.description,
    type: categoryToEventType[activity.category] || "activity",
    cost: activity.costPerPerson,
    bookingStatus: activity.reservationRequired ? "not_booked" : "confirmed",
    notes: activity.insiderTip ?? activity.bookingInfo,
  }));
}
