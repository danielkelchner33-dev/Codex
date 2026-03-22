// ============================================================
// StagParty.io — Itinerary Builder Agent
// Auto-generates optimized day-by-day itineraries
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { generateId } from "@/utils/helpers";
import type {
  Itinerary,
  ItineraryDay,
  ItineraryEvent,
  EventType,
} from "@/models/types";

// ── Input / Output Types ────────────────────────────────────

export interface ItineraryBuilderInput {
  destination: string;
  startDate: string;
  endDate: string;
  activities: Array<{
    name: string;
    duration: string;
    bestTimeOfDay: string;
    cost: number;
    location?: string;
    reservationRequired?: boolean;
  }>;
  transport: {
    outboundDeparture: string;
    outboundArrival: string;
    returnDeparture: string;
    returnArrival: string;
    provider: string;
    route: string;
  };
  accommodation: {
    name: string;
    checkIn: string;
    checkOut: string;
    location?: string;
  };
  groupSize: number;
}

interface RawItineraryEvent {
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: string;
  location?: string;
  cost?: number;
  notes?: string;
}

interface RawItineraryDay {
  date: string;
  title: string;
  events: RawItineraryEvent[];
}

interface RawItineraryOutput {
  days: RawItineraryDay[];
  notes: string;
  tips: string[];
  estimatedTotalCost: number;
}

// ── Tool Schema ─────────────────────────────────────────────

const ITINERARY_TOOL: Anthropic.Messages.Tool = {
  name: "submit_itinerary",
  description:
    "Submit the complete day-by-day itinerary with optimized scheduling.",
  input_schema: {
    type: "object" as const,
    properties: {
      days: {
        type: "array",
        items: {
          type: "object",
          properties: {
            date: { type: "string", description: "ISO date string" },
            title: {
              type: "string",
              description: "Day title, e.g. 'Day 1 — Arrival & Setup'",
            },
            events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  time: { type: "string", description: "Start time HH:MM" },
                  endTime: { type: "string", description: "End time HH:MM" },
                  title: { type: "string" },
                  description: { type: "string" },
                  type: {
                    type: "string",
                    enum: [
                      "transport",
                      "accommodation",
                      "activity",
                      "meal",
                      "drinks",
                      "free_time",
                      "ceremony",
                      "custom",
                    ],
                  },
                  location: { type: "string" },
                  cost: { type: "number" },
                  notes: { type: "string" },
                },
                required: ["time", "title", "description", "type"],
              },
            },
          },
          required: ["date", "title", "events"],
        },
      },
      notes: {
        type: "string",
        description: "General notes and packing list reminders",
      },
      tips: {
        type: "array",
        items: { type: "string" },
        description: "Pro tips for the best man and crew",
      },
      estimatedTotalCost: {
        type: "number",
        description: "Estimated total cost per person for the full trip",
      },
    },
    required: ["days", "notes", "tips", "estimatedTotalCost"],
  },
};

// ── Main Builder Function ───────────────────────────────────

export async function buildItinerary(
  input: ItineraryBuilderInput,
  partyId: string,
): Promise<Itinerary> {
  const client = new Anthropic();

  const systemPrompt = `You are StagParty's Itinerary Builder Agent. You create optimized day-by-day bachelor party itineraries.

OPTIMIZATION RULES:
1. Travel time: Schedule activities near each other to minimize transit between venues.
2. Meal breaks: Include breakfast, lunch, and dinner at realistic times. Groups get hungry and grumpy.
3. Energy levels: Start with moderate energy, peak mid-day, wind down in the evening.
   - Morning: Active (hiking, water sports, fishing)
   - Afternoon: Moderate (tours, games, chill activities)
   - Evening: Social (dinner, bar crawl, BBQ)
4. Buffer time: Add 15-30 min buffers between activities. Bachelor parties are never on time.
5. Free time: Include at least 1 hour of unstructured time per day. Not everything needs to be planned.
6. First day: Keep it light — travel, settle in, easy welcome activity.
7. Last day: Pack up, one final activity, travel home. Don't overpack.
8. Group size: Consider that larger groups move slower and need more coordination.

For each event, include:
- Precise start and end times
- Clear description
- Location when applicable
- Cost per person
- Any notes or tips

Use the submit_itinerary tool to provide your structured response.`;

  const userMessage = `Build an optimized itinerary for this bachelor party:

DESTINATION: ${input.destination}
DATES: ${input.startDate} to ${input.endDate}
GROUP SIZE: ${input.groupSize} people

TRANSPORT:
- Outbound: ${input.transport.provider} ${input.transport.route}
  Depart ${input.transport.outboundDeparture}, Arrive ${input.transport.outboundArrival}
- Return: Depart ${input.transport.returnDeparture}, Arrive ${input.transport.returnArrival}

ACCOMMODATION:
- ${input.accommodation.name}
  Check-in: ${input.accommodation.checkIn}, Check-out: ${input.accommodation.checkOut}
  ${input.accommodation.location ? `Location: ${input.accommodation.location}` : ""}

ACTIVITIES TO SCHEDULE:
${input.activities
  .map(
    (a, i) =>
      `${i + 1}. ${a.name} (${a.duration}, best: ${a.bestTimeOfDay}, $${a.cost}/person${a.reservationRequired ? " — RESERVATION REQUIRED" : ""})`,
  )
  .join("\n")}

Create the optimal day-by-day schedule. Use the tool to submit.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [ITINERARY_TOOL],
    tool_choice: { type: "tool", name: "submit_itinerary" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use",
  );

  let rawOutput: RawItineraryOutput;

  if (toolUseBlock && toolUseBlock.type === "tool_use") {
    rawOutput = toolUseBlock.input as RawItineraryOutput;
  } else {
    rawOutput = buildFallbackItinerary(input);
  }

  // Convert raw output to typed Itinerary
  return convertToItinerary(rawOutput, partyId);
}

// ── Fallback Builder ────────────────────────────────────────

function buildFallbackItinerary(input: ItineraryBuilderInput): RawItineraryOutput {
  const start = new Date(input.startDate);
  const end = new Date(input.endDate);
  const dayCount = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  ) + 1;

  const days: RawItineraryDay[] = [];

  for (let i = 0; i < dayCount; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const events: RawItineraryEvent[] = [];

    if (i === 0) {
      // Arrival day
      events.push(
        {
          time: input.transport.outboundDeparture,
          endTime: input.transport.outboundArrival,
          title: `Depart — ${input.transport.route}`,
          description: `${input.transport.provider}. Meet at departure point 30 min early.`,
          type: "transport",
        },
        {
          time: input.accommodation.checkIn,
          title: `Check in — ${input.accommodation.name}`,
          description: "Drop bags, settle in, get the lay of the land.",
          type: "accommodation",
        },
        {
          time: "12:30",
          endTime: "13:30",
          title: "Lunch",
          description: "First group meal — find a spot near accommodation.",
          type: "meal",
          cost: 20,
        },
        {
          time: "18:00",
          endTime: "19:30",
          title: "Welcome Dinner",
          description: "Group dinner to kick off the bachelor party.",
          type: "meal",
          cost: 40,
        },
        {
          time: "20:00",
          endTime: "23:00",
          title: "Night Out",
          description: "First night drinks — keep it moderate, big days ahead.",
          type: "drinks",
          cost: 30,
        },
      );
    } else if (i === dayCount - 1) {
      // Departure day
      events.push(
        {
          time: "08:00",
          endTime: "09:00",
          title: "Breakfast & Pack Up",
          description: "Final breakfast. Pack bags and check out.",
          type: "meal",
          cost: 15,
        },
        {
          time: input.accommodation.checkOut,
          title: `Check out — ${input.accommodation.name}`,
          description: "Bags packed, room cleaned, keys returned.",
          type: "accommodation",
        },
        {
          time: input.transport.returnDeparture,
          endTime: input.transport.returnArrival,
          title: `Return — ${input.transport.route}`,
          description: `${input.transport.provider} home. What a trip.`,
          type: "transport",
        },
      );
    } else {
      // Full activity days
      const morningActivities = input.activities.filter(
        (a) => a.bestTimeOfDay === "morning",
      );
      const afternoonActivities = input.activities.filter(
        (a) => a.bestTimeOfDay === "afternoon" || a.bestTimeOfDay === "any",
      );
      const eveningActivities = input.activities.filter(
        (a) => a.bestTimeOfDay === "evening",
      );

      events.push({
        time: "08:00",
        endTime: "09:00",
        title: "Breakfast",
        description: "Group breakfast — fuel up for the day.",
        type: "meal",
        cost: 15,
      });

      const morningAct = morningActivities[i % morningActivities.length];
      if (morningAct) {
        events.push({
          time: "09:30",
          endTime: "12:00",
          title: morningAct.name,
          description: `${morningAct.duration}. ${morningAct.reservationRequired ? "Reservation required." : "Walk-in OK."}`,
          type: "activity",
          cost: morningAct.cost,
          location: morningAct.location,
        });
      }

      events.push({
        time: "12:30",
        endTime: "13:30",
        title: "Lunch",
        description: "Refuel. Hydrate. Maybe a cold beer.",
        type: "meal",
        cost: 20,
      });

      events.push({
        time: "13:30",
        endTime: "14:30",
        title: "Free Time",
        description: "Rest, explore, nap — dealer's choice.",
        type: "free_time",
      });

      const afternoonAct = afternoonActivities[i % Math.max(afternoonActivities.length, 1)];
      if (afternoonAct) {
        events.push({
          time: "14:30",
          endTime: "17:00",
          title: afternoonAct.name,
          description: `${afternoonAct.duration}. ${afternoonAct.reservationRequired ? "Reservation required." : "Walk-in OK."}`,
          type: "activity",
          cost: afternoonAct.cost,
          location: afternoonAct.location,
        });
      }

      events.push({
        time: "18:00",
        endTime: "19:30",
        title: "Dinner",
        description: "Group dinner.",
        type: "meal",
        cost: 40,
      });

      const eveningAct = eveningActivities[i % Math.max(eveningActivities.length, 1)];
      if (eveningAct) {
        events.push({
          time: "20:00",
          endTime: "23:00",
          title: eveningAct.name,
          description: eveningAct.duration,
          type: "drinks",
          cost: eveningAct.cost,
        });
      }
    }

    days.push({
      date: dateStr,
      title: i === 0
        ? "Day 1 — Arrival & Setup"
        : i === dayCount - 1
          ? `Day ${i + 1} — Farewell & Home`
          : `Day ${i + 1} — Full Send`,
      events,
    });
  }

  return {
    days,
    notes:
      "Pack light, bring sunscreen, and remember: what happens at the bachelor party... gets posted on Instagram anyway.",
    tips: [
      "Assign a 'logistics guy' to handle timing and reservations",
      "Create a group chat for real-time coordination",
      "Bring a portable phone charger — you'll need it",
      "Designate a photographer for key moments",
      "Keep the groom's schedule a surprise if you can",
    ],
    estimatedTotalCost: input.activities.reduce((sum, a) => sum + a.cost, 0) + 150,
  };
}

// ── Convert to Platform Itinerary ───────────────────────────

function convertToItinerary(
  raw: RawItineraryOutput,
  partyId: string,
): Itinerary {
  const validEventTypes: EventType[] = [
    "transport",
    "accommodation",
    "activity",
    "meal",
    "drinks",
    "free_time",
    "ceremony",
    "custom",
  ];

  const days: ItineraryDay[] = raw.days.map((day) => ({
    date: day.date,
    title: day.title,
    events: day.events.map((event) => ({
      id: generateId("evt"),
      time: event.time,
      endTime: event.endTime,
      title: event.title,
      description: event.description,
      type: validEventTypes.includes(event.type as EventType)
        ? (event.type as EventType)
        : "custom",
      location: event.location,
      cost: event.cost,
      bookingStatus: "not_booked" as const,
      notes: event.notes,
    })),
  }));

  return {
    id: generateId("itin"),
    partyId,
    days,
    notes: raw.notes,
    lastUpdated: new Date().toISOString(),
  };
}
