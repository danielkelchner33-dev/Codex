// ============================================================
// StagParty.io — Transport Planner Agent
// Finds optimal group transportation options
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import type { ItineraryEvent } from "@/models/types";
import { generateId } from "@/utils/helpers";

// ── Input / Output Types ────────────────────────────────────

export interface TransportPlannerInput {
  origin: string;
  destination: string;
  groupSize: number;
  startDate: string;
  endDate: string;
}

export interface TransportOption {
  provider: string;
  route: string;
  departureLocation: string;
  arrivalLocation: string;
  schedule: string;
  pricePerPerson: number;
  totalGroupPrice: number;
  travelTime: string;
  groupRate: boolean;
  groupRateDetails?: string;
  mode: "ferry" | "flight" | "drive" | "bus" | "charter" | "train";
  outbound: {
    departureTime: string;
    arrivalTime: string;
  };
  returnTrip: {
    departureTime: string;
    arrivalTime: string;
  };
  bookingUrl?: string;
  notes: string;
}

export interface TransportPlannerOutput {
  options: TransportOption[];
  recommendation: string;
  comparison: string;
}

// ── Built-in Catalina Knowledge ─────────────────────────────

const CATALINA_TRANSPORT_KNOWLEDGE = `
VERIFIED CATALINA ISLAND TRANSPORT OPTIONS:

1. Catalina Express — Newport Beach Route
   - Route: Newport Beach (Balboa Pavilion) to Avalon
   - Travel Time: ~75 minutes
   - Price: $76.50 round-trip per adult
   - Schedule: 2-3 departures daily (first ~9:00 AM, last varies by season)
   - Group Rates: Groups of 20+ get 10% discount. Call (800) 613-1212.
   - Parking: $22/day at Newport Beach terminal lot
   - Pros: Closer for Orange County groups, scenic harbor departure
   - Cons: Fewer daily departures than San Pedro, smaller vessel

2. Catalina Express — San Pedro Route
   - Route: San Pedro (Berth 95) to Avalon
   - Travel Time: ~60 minutes
   - Price: $76.50 round-trip per adult
   - Schedule: 4-6 departures daily (first ~6:15 AM, last varies)
   - Group Rates: Same 20+ group discount at 10%
   - Parking: $22/day at San Pedro terminal lot
   - Pros: More frequent departures, faster crossing, larger vessels
   - Cons: Further drive from Orange County, San Pedro area less scenic

3. Catalina Express — Long Beach Route
   - Route: Long Beach (320 Golden Shore) to Avalon
   - Travel Time: ~60 minutes
   - Price: $76.50 round-trip per adult
   - Schedule: Multiple daily departures
   - Parking: $22/day
   - Pros: Central location, easy freeway access
   - Cons: Terminal area under frequent construction

4. Catalina Flyer — Newport Beach
   - Route: Newport Beach (Balboa Pavilion) to Avalon
   - Travel Time: ~75 minutes
   - Price: ~$70 round-trip per adult
   - Schedule: 1 departure daily (9:00 AM out, 4:30 PM return)
   - Pros: Often slightly cheaper, dedicated Newport service
   - Cons: Only one departure per day — no flexibility

TIPS FOR BACHELOR PARTY GROUPS:
- Book the earliest ferry out to maximize island time
- Book the latest ferry back (usually 5-7 PM depending on season)
- Bring coolers with drinks for the ferry ride (allowed on board)
- Sit on the top/outside deck for the best experience
- If anyone gets seasick, sit in the center lower deck and take Dramamine beforehand
- Pre-book round-trip to save hassle on the island
`;

// ── Tool Schema ─────────────────────────────────────────────

const TRANSPORT_TOOL: Anthropic.Messages.Tool = {
  name: "submit_transport_options",
  description:
    "Submit transport options comparing routes, schedules, and group pricing.",
  input_schema: {
    type: "object" as const,
    properties: {
      options: {
        type: "array",
        items: {
          type: "object",
          properties: {
            provider: { type: "string" },
            route: { type: "string" },
            departureLocation: { type: "string" },
            arrivalLocation: { type: "string" },
            schedule: { type: "string" },
            pricePerPerson: { type: "number" },
            totalGroupPrice: { type: "number" },
            travelTime: { type: "string" },
            groupRate: { type: "boolean" },
            groupRateDetails: { type: "string" },
            mode: {
              type: "string",
              enum: ["ferry", "flight", "drive", "bus", "charter", "train"],
            },
            outbound: {
              type: "object",
              properties: {
                departureTime: { type: "string" },
                arrivalTime: { type: "string" },
              },
              required: ["departureTime", "arrivalTime"],
            },
            returnTrip: {
              type: "object",
              properties: {
                departureTime: { type: "string" },
                arrivalTime: { type: "string" },
              },
              required: ["departureTime", "arrivalTime"],
            },
            bookingUrl: { type: "string" },
            notes: { type: "string" },
          },
          required: [
            "provider",
            "route",
            "departureLocation",
            "arrivalLocation",
            "schedule",
            "pricePerPerson",
            "totalGroupPrice",
            "travelTime",
            "groupRate",
            "mode",
            "outbound",
            "returnTrip",
            "notes",
          ],
        },
      },
      recommendation: {
        type: "string",
        description: "Which option is best for this group and why",
      },
      comparison: {
        type: "string",
        description: "Brief comparison summary of the key trade-offs",
      },
    },
    required: ["options", "recommendation", "comparison"],
  },
};

// ── Main Planner Function ───────────────────────────────────

export async function planTransport(
  input: TransportPlannerInput,
): Promise<TransportPlannerOutput> {
  const client = new Anthropic();

  const isCatalina =
    input.destination.toLowerCase().includes("catalina") ||
    input.destination.toLowerCase().includes("avalon");

  const systemPrompt = `You are StagParty's Transport Planning Agent. You find the optimal group transportation for bachelor parties.

Compare all viable routes and modes of transport. For each option include:
- Exact route with departure/arrival locations
- Schedule with recommended departure and return times
- Per-person and total group pricing
- Travel time
- Group rate availability
- Practical tips for bachelor party groups

${isCatalina ? `VERIFIED CATALINA TRANSPORT DATA — use this as your primary source:\n${CATALINA_TRANSPORT_KNOWLEDGE}` : ""}

Always present at least 3 options at different price/convenience trade-offs.
Be specific — bachelor parties need exact times and locations, not vague suggestions.

Use the submit_transport_options tool to provide your structured response.`;

  const userMessage = `Find transport options for this bachelor party:

- Origin: ${input.origin}
- Destination: ${input.destination}
- Group Size: ${input.groupSize} people
- Outbound Date: ${input.startDate}
- Return Date: ${input.endDate}

Compare all viable transport options with group pricing. Recommend the best option for the group.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [TRANSPORT_TOOL],
    tool_choice: { type: "tool", name: "submit_transport_options" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use",
  );

  if (toolUseBlock && toolUseBlock.type === "tool_use") {
    return toolUseBlock.input as TransportPlannerOutput;
  }

  // Fallback for Catalina
  return {
    options: [
      {
        provider: "Catalina Express",
        route: "Newport Beach to Avalon",
        departureLocation: "Balboa Pavilion, Newport Beach",
        arrivalLocation: "Avalon Harbor, Catalina Island",
        schedule: "Multiple daily departures, first at 9:00 AM",
        pricePerPerson: 76.5,
        totalGroupPrice: 76.5 * input.groupSize,
        travelTime: "75 minutes",
        groupRate: input.groupSize >= 20,
        mode: "ferry",
        outbound: { departureTime: "09:00", arrivalTime: "10:15" },
        returnTrip: { departureTime: "17:30", arrivalTime: "18:45" },
        bookingUrl: "https://www.catalinaexpress.com",
        notes: "Book early for weekend trips. Bring a cooler — drinks allowed on board.",
      },
      {
        provider: "Catalina Express",
        route: "San Pedro to Avalon",
        departureLocation: "Berth 95, San Pedro",
        arrivalLocation: "Avalon Harbor, Catalina Island",
        schedule: "4-6 daily departures, first at 6:15 AM",
        pricePerPerson: 76.5,
        totalGroupPrice: 76.5 * input.groupSize,
        travelTime: "60 minutes",
        groupRate: input.groupSize >= 20,
        mode: "ferry",
        outbound: { departureTime: "06:15", arrivalTime: "07:15" },
        returnTrip: { departureTime: "19:00", arrivalTime: "20:00" },
        bookingUrl: "https://www.catalinaexpress.com",
        notes:
          "Most departures and fastest crossing. Best for maximizing island time.",
      },
    ],
    recommendation:
      "San Pedro route offers the most schedule flexibility with the fastest crossing time.",
    comparison:
      "Newport Beach is closer for OC groups but has fewer departures. San Pedro is faster with more schedule options. Both cost the same per person.",
  };
}

// ── Convert to Itinerary Events ─────────────────────────────

export function toTransportEvents(
  option: TransportOption,
  startDate: string,
  endDate: string,
): ItineraryEvent[] {
  return [
    {
      id: generateId("evt"),
      time: option.outbound.departureTime,
      endTime: option.outbound.arrivalTime,
      title: `${option.mode === "ferry" ? "Ferry" : "Depart"} — ${option.route}`,
      description: `${option.provider}: ${option.departureLocation} to ${option.arrivalLocation}. ${option.notes}`,
      type: "transport",
      location: option.departureLocation,
      cost: option.pricePerPerson,
      bookingUrl: option.bookingUrl,
      bookingStatus: "not_booked",
    },
    {
      id: generateId("evt"),
      time: option.returnTrip.departureTime,
      endTime: option.returnTrip.arrivalTime,
      title: `Return ${option.mode === "ferry" ? "Ferry" : "Trip"} — ${option.arrivalLocation} to ${option.departureLocation}`,
      description: `${option.provider} return trip. Don't miss the last departure!`,
      type: "transport",
      location: option.arrivalLocation,
      cost: 0,
      bookingStatus: "not_booked",
    },
  ];
}
