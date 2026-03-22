// ============================================================
// StagParty.io — Destination Researcher Agent
// Finds and ranks bachelor party destinations
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { generateId } from "@/utils/helpers";
import type { Destination, DestinationType } from "@/models/types";

// ── Input / Output Types ────────────────────────────────────

export interface DestinationResearchInput {
  vibe: string;
  groupSize: number;
  budget: number;
  travelFrom: string;
}

export interface DestinationRecommendation {
  name: string;
  description: string;
  type: DestinationType;
  pros: string[];
  cons: string[];
  estimatedCostPerPerson: number;
  travelLogistics: string;
  highlights: string[];
  location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
}

export interface DestinationResearchOutput {
  destinations: DestinationRecommendation[];
  reasoning: string;
}

// ── Built-in Knowledge ──────────────────────────────────────

const CATALINA_KNOWLEDGE: DestinationRecommendation = {
  name: "Catalina Island",
  description:
    "A rugged island paradise just 22 miles off the SoCal coast. Avalon offers bars, restaurants, and nightlife while Two Harbors provides a rustic camping and adventure experience. Perfect for groups that want beach vibes with an island escape feel without needing a passport.",
  type: "island",
  pros: [
    "Only 1-hour ferry from mainland — easy logistics",
    "Island vibes without international travel hassle",
    "Mix of adventure (hiking, snorkeling, kayaking) and chill (beaches, bars)",
    "Group-friendly camping at Two Harbors",
    "Golf carts instead of cars — instant fun factor",
    "Great restaurants and bars in Avalon harbor",
  ],
  cons: [
    "Limited nightlife compared to Vegas or Miami",
    "Ferry can sell out on peak weekends — book early",
    "Alcohol and supply options limited on the island",
    "Weather-dependent ferry schedule",
    "Two Harbors is remote — limited cell service",
  ],
  estimatedCostPerPerson: 350,
  travelLogistics:
    "Catalina Express ferry from Newport Beach ($76.50 round-trip, 75 min) or San Pedro ($76.50 round-trip, 60 min). Ferries run multiple times daily. Book the first morning ferry out and the last evening ferry back. Luggage allowed but keep it light for the harbor walk.",
  highlights: [
    "Snorkeling at Lovers Cove",
    "Hiking the Trans-Catalina Trail",
    "Kayaking at Two Harbors",
    "Bar hopping in Avalon",
    "Deep-sea fishing charters",
    "Buffalo herd sightings",
    "Harbor BBQ cookout",
    "Zip-line Eco Tour",
  ],
  location: {
    city: "Avalon",
    state: "CA",
    lat: 33.3428,
    lng: -118.3287,
  },
};

// ── Tool Schema ─────────────────────────────────────────────

const DESTINATION_TOOL: Anthropic.Messages.Tool = {
  name: "submit_destinations",
  description:
    "Submit the top 5 destination recommendations with detailed analysis for each.",
  input_schema: {
    type: "object" as const,
    properties: {
      destinations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Destination name" },
            description: {
              type: "string",
              description: "2-3 sentence description of why this works for a bachelor party",
            },
            type: {
              type: "string",
              enum: ["beach", "mountain", "city", "island", "camping", "adventure", "international"],
            },
            pros: {
              type: "array",
              items: { type: "string" },
              description: "3-6 specific pros",
            },
            cons: {
              type: "array",
              items: { type: "string" },
              description: "2-4 honest cons",
            },
            estimatedCostPerPerson: {
              type: "number",
              description: "Estimated total cost per person in USD",
            },
            travelLogistics: {
              type: "string",
              description: "How to get there from the origin, including transport options and times",
            },
            highlights: {
              type: "array",
              items: { type: "string" },
              description: "Top 5-8 things to do",
            },
            location: {
              type: "object",
              properties: {
                city: { type: "string" },
                state: { type: "string" },
                lat: { type: "number" },
                lng: { type: "number" },
              },
              required: ["city", "state", "lat", "lng"],
            },
          },
          required: [
            "name",
            "description",
            "type",
            "pros",
            "cons",
            "estimatedCostPerPerson",
            "travelLogistics",
            "highlights",
            "location",
          ],
        },
      },
      reasoning: {
        type: "string",
        description: "Brief explanation of how destinations were selected and ranked",
      },
    },
    required: ["destinations", "reasoning"],
  },
};

// ── Main Research Function ──────────────────────────────────

export async function researchDestinations(
  input: DestinationResearchInput,
): Promise<DestinationResearchOutput> {
  const client = new Anthropic();

  const systemPrompt = `You are StagParty's Destination Research Agent. You help bachelor party groups find the perfect destination.

Your task: Recommend the TOP 5 destinations based on the group's vibe, size, budget, and travel origin.

IMPORTANT KNOWLEDGE — Catalina Island:
If the group is traveling from Southern California and has an outdoorsy/adventure/beach vibe with a moderate budget,
you MUST include Catalina Island as one of the top options. Here is verified information:
${JSON.stringify(CATALINA_KNOWLEDGE, null, 2)}

For all destinations:
- Be specific with cost estimates (transport + accommodation + activities + food/drink for the trip)
- Include realistic travel logistics from the origin city
- Consider group dynamics — bachelor parties need easy logistics, group-friendly venues, and memorable experiences
- Balance well-known destinations with hidden gems
- Consider the season and weather
- Factor in group size for accommodation availability

Use the submit_destinations tool to provide your structured response.`;

  const userMessage = `Find the top 5 bachelor party destinations for this group:

- Vibe: ${input.vibe}
- Group Size: ${input.groupSize} people
- Budget: $${input.budget} per person (total trip)
- Traveling From: ${input.travelFrom}

Rank them from best match to 5th best. Use the tool to submit your structured recommendations.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    tools: [DESTINATION_TOOL],
    tool_choice: { type: "tool", name: "submit_destinations" },
    messages: [{ role: "user", content: userMessage }],
  });

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use",
  );

  if (toolUseBlock && toolUseBlock.type === "tool_use") {
    const result = toolUseBlock.input as DestinationResearchOutput;
    return result;
  }

  // Fallback: return Catalina as sole result if tool_use parsing fails
  return {
    destinations: [CATALINA_KNOWLEDGE],
    reasoning: "Fallback result — AI tool response could not be parsed.",
  };
}

// ── Convert to Platform Destination ─────────────────────────

export function toDestination(rec: DestinationRecommendation): Destination {
  return {
    id: generateId("dest"),
    name: rec.name,
    description: rec.description,
    type: rec.type,
    location: rec.location,
    estimatedCostPerPerson: rec.estimatedCostPerPerson,
    highlights: rec.highlights,
  };
}
