// ============================================================
// StagParty.io — Agent Orchestrator
// Main coordinator for all AI agent workflows
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { generateId } from "@/utils/helpers";
import type {
  AgentWorkflow,
  AgentTaskType,
  AgentStatus,
  AgentStep,
} from "@/models/types";

// ── System Prompts ──────────────────────────────────────────

const SYSTEM_PROMPTS: Record<AgentTaskType, string> = {
  research_destinations: `You are StagParty's Destination Research Agent. You help bachelor party groups find the perfect destination.
Analyze the group's vibe, size, budget, and travel origin to recommend the top 5 destinations.
For each destination provide: name, description, pros, cons, estimated cost per person, travel logistics, and highlights.
Always consider group dynamics — bachelor parties need easy logistics, group-friendly venues, and memorable experiences.
Be specific with cost estimates and logistics. Include both well-known and hidden-gem options.`,

  find_accommodations: `You are StagParty's Accommodation Finder Agent. You help bachelor party groups find the best places to stay.
Consider group size, budget, and destination to recommend accommodations that work for groups.
Prioritize places that can host the whole crew together — vacation rentals, group suites, or adjacent rooms.
Include pricing, amenities, proximity to activities, and booking tips.`,

  book_transport: `You are StagParty's Transport Planning Agent. You find optimal group transportation options.
Compare routes, schedules, pricing, and group rates for getting the crew to the destination.
Consider carpooling logistics, ferry schedules, flight options, and charter services.
Always provide multiple options at different price points with clear trade-offs.`,

  plan_activities: `You are StagParty's Activity Curator Agent. You curate the ultimate bachelor party activity lineup.
Match activities to the group's vibe, size, budget, and destination.
Include a mix of adventure, relaxation, food/drink, and bonding experiences.
Provide booking info, costs, duration, group size requirements, and insider tips.
Balance high-energy activities with downtime — nobody wants a burned-out crew.`,

  compare_prices: `You are StagParty's Price Comparison Agent. You find the best deals across providers.
Compare prices for accommodations, transport, activities, and dining.
Factor in group discounts, promo codes, and package deals.
Present clear comparison tables with total cost breakdowns.`,

  send_reminders: `You are StagParty's Communications Agent. You draft and schedule reminders for the group.
Create personalized messages for RSVPs, payments, packing lists, and logistics updates.
Keep the tone fun and on-brand — this is a bachelor party, not a corporate retreat.`,

  collect_payments: `You are StagParty's Payment Coordination Agent. You help organize cost splitting and payment collection.
Calculate fair splits, track who has paid, and generate payment reminders.
Support scenarios like covering the groom's costs and custom split arrangements.`,

  generate_itinerary: `You are StagParty's Itinerary Builder Agent. You create optimized day-by-day itineraries.
Build a complete schedule that balances activities, meals, transport, and free time.
Optimize for travel times between venues, energy levels throughout the day, and meal timing.
Include buffer time for the inevitable bachelor party chaos.
Output a structured itinerary with specific times, locations, and booking references.`,

  coordinate_logistics: `You are StagParty's Logistics Coordinator Agent. You handle the operational details.
Coordinate pickup times, meeting points, reservation confirmations, and contingency plans.
Create checklists and assign responsibilities to keep everything running smoothly.`,

  find_partner_deals: `You are StagParty's Deal Finder Agent. You find exclusive partner deals and discounts.
Search for group rates, promo codes, and package deals relevant to the party's destination and activities.
Prioritize verified deals with clear terms and genuine savings.`,
};

// ── Result Types ────────────────────────────────────────────

export interface DestinationResult {
  name: string;
  description: string;
  type: string;
  pros: string[];
  cons: string[];
  estimatedCostPerPerson: number;
  travelLogistics: string;
  highlights: string[];
}

export interface TransportOption {
  provider: string;
  route: string;
  schedule: string;
  pricePerPerson: number;
  totalGroupPrice: number;
  travelTime: string;
  groupRate: boolean;
  notes: string;
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
}

export type AgentResultMap = {
  research_destinations: { destinations: DestinationResult[] };
  book_transport: { options: TransportOption[] };
  plan_activities: { activities: CuratedActivity[] };
  generate_itinerary: { itinerary: Record<string, unknown> };
  find_accommodations: { accommodations: Record<string, unknown>[] };
  compare_prices: { comparisons: Record<string, unknown>[] };
  send_reminders: { messages: Record<string, unknown>[] };
  collect_payments: { summary: Record<string, unknown> };
  coordinate_logistics: { plan: Record<string, unknown> };
  find_partner_deals: { deals: Record<string, unknown>[] };
};

// ── Streaming Callback ─────────────────────────────────────

export type StreamCallback = (event: {
  workflowId: string;
  type: "step_start" | "step_complete" | "token" | "workflow_complete" | "error";
  stepName?: string;
  token?: string;
  result?: unknown;
  error?: string;
}) => void;

// ── Workflow Store ──────────────────────────────────────────

const workflowStore = new Map<string, AgentWorkflow>();

// ── Orchestrator Class ──────────────────────────────────────

export class AgentOrchestrator {
  private client: Anthropic;
  private taskQueue: Array<{
    workflow: AgentWorkflow;
    resolve: (result: AgentWorkflow) => void;
    reject: (error: Error) => void;
  }> = [];
  private activeTasks = 0;
  private maxConcurrent = 3;

  constructor() {
    this.client = new Anthropic();
  }

  // ── Public API ──────────────────────────────────────────

  async runWorkflow<T extends AgentTaskType>(
    type: T,
    input: Record<string, unknown>,
    partyId: string,
    onStream?: StreamCallback,
  ): Promise<AgentWorkflow> {
    const workflow: AgentWorkflow = {
      id: generateId("wf"),
      partyId,
      type,
      status: "queued",
      input,
      steps: [],
      createdAt: new Date().toISOString(),
    };

    workflowStore.set(workflow.id, workflow);

    return new Promise<AgentWorkflow>((resolve, reject) => {
      this.taskQueue.push({ workflow, resolve, reject });
      this.processQueue(onStream);
    });
  }

  getWorkflowStatus(id: string): AgentWorkflow | null {
    return workflowStore.get(id) ?? null;
  }

  cancelWorkflow(id: string): boolean {
    const workflow = workflowStore.get(id);
    if (!workflow) return false;

    if (workflow.status === "queued") {
      this.taskQueue = this.taskQueue.filter((t) => t.workflow.id !== id);
      workflow.status = "failed";
      this.addStep(workflow, "Cancelled", "Workflow cancelled by user", "failed");
      return true;
    }

    if (workflow.status === "running") {
      workflow.status = "failed";
      this.addStep(workflow, "Cancelled", "Workflow cancelled by user", "failed");
      this.activeTasks--;
      return true;
    }

    return false;
  }

  getAllWorkflows(partyId: string): AgentWorkflow[] {
    const workflows: AgentWorkflow[] = [];
    workflowStore.forEach((wf) => {
      if (wf.partyId === partyId) workflows.push(wf);
    });
    return workflows.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // ── Queue Processing ──────────────────────────────────

  private async processQueue(onStream?: StreamCallback): Promise<void> {
    while (this.taskQueue.length > 0 && this.activeTasks < this.maxConcurrent) {
      const task = this.taskQueue.shift();
      if (!task) break;

      this.activeTasks++;
      this.executeWorkflow(task.workflow, onStream)
        .then((result) => {
          this.activeTasks--;
          task.resolve(result);
          this.processQueue(onStream);
        })
        .catch((error) => {
          this.activeTasks--;
          task.reject(error);
          this.processQueue(onStream);
        });
    }
  }

  // ── Workflow Execution ────────────────────────────────

  private async executeWorkflow(
    workflow: AgentWorkflow,
    onStream?: StreamCallback,
  ): Promise<AgentWorkflow> {
    workflow.status = "running";

    try {
      // Step 1: Analyze input
      this.addStep(workflow, "Analyzing Input", "Parsing request parameters", "running");
      onStream?.({
        workflowId: workflow.id,
        type: "step_start",
        stepName: "Analyzing Input",
      });

      const systemPrompt = SYSTEM_PROMPTS[workflow.type];
      const userMessage = this.buildUserMessage(workflow.type, workflow.input);

      this.completeStep(workflow, "Analyzing Input");
      onStream?.({
        workflowId: workflow.id,
        type: "step_complete",
        stepName: "Analyzing Input",
      });

      // Step 2: Run Claude with tool_use for structured output
      this.addStep(workflow, "AI Processing", "Generating recommendations", "running");
      onStream?.({
        workflowId: workflow.id,
        type: "step_start",
        stepName: "AI Processing",
      });

      const tools = this.getToolsForType(workflow.type);

      const stream = this.client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: systemPrompt,
        tools,
        messages: [{ role: "user", content: userMessage }],
      });

      // Stream tokens for real-time UI
      stream.on("text", (text) => {
        onStream?.({
          workflowId: workflow.id,
          type: "token",
          token: text,
        });
      });

      const response = await stream.finalMessage();

      // Extract structured result from tool_use blocks
      const toolUseBlock = response.content.find(
        (block) => block.type === "tool_use",
      );

      const result = toolUseBlock && "input" in toolUseBlock
        ? (toolUseBlock.input as Record<string, unknown>)
        : this.extractFallbackResult(response);

      this.completeStep(workflow, "AI Processing");
      onStream?.({
        workflowId: workflow.id,
        type: "step_complete",
        stepName: "AI Processing",
      });

      // Step 3: Finalize
      this.addStep(workflow, "Finalizing", "Formatting results", "running");
      workflow.output = result;
      workflow.status = "completed";
      workflow.completedAt = new Date().toISOString();
      this.completeStep(workflow, "Finalizing");

      onStream?.({
        workflowId: workflow.id,
        type: "workflow_complete",
        result,
      });

      return workflow;
    } catch (error) {
      workflow.status = "failed";
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      this.addStep(workflow, "Error", errorMsg, "failed");

      onStream?.({
        workflowId: workflow.id,
        type: "error",
        error: errorMsg,
      });

      return workflow;
    }
  }

  // ── Tool Definitions ──────────────────────────────────

  private getToolsForType(type: AgentTaskType): Anthropic.Messages.Tool[] {
    const toolMap: Partial<Record<AgentTaskType, Anthropic.Messages.Tool[]>> = {
      research_destinations: [
        {
          name: "submit_destinations",
          description: "Submit the top 5 destination recommendations",
          input_schema: {
            type: "object" as const,
            properties: {
              destinations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    type: { type: "string" },
                    pros: { type: "array", items: { type: "string" } },
                    cons: { type: "array", items: { type: "string" } },
                    estimatedCostPerPerson: { type: "number" },
                    travelLogistics: { type: "string" },
                    highlights: { type: "array", items: { type: "string" } },
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
                  ],
                },
              },
            },
            required: ["destinations"],
          },
        },
      ],
      book_transport: [
        {
          name: "submit_transport_options",
          description: "Submit transport route options with pricing",
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
                    schedule: { type: "string" },
                    pricePerPerson: { type: "number" },
                    totalGroupPrice: { type: "number" },
                    travelTime: { type: "string" },
                    groupRate: { type: "boolean" },
                    notes: { type: "string" },
                  },
                  required: [
                    "provider",
                    "route",
                    "schedule",
                    "pricePerPerson",
                    "totalGroupPrice",
                    "travelTime",
                    "groupRate",
                    "notes",
                  ],
                },
              },
            },
            required: ["options"],
          },
        },
      ],
      plan_activities: [
        {
          name: "submit_activities",
          description: "Submit curated activity recommendations",
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
                  ],
                },
              },
            },
            required: ["activities"],
          },
        },
      ],
      generate_itinerary: [
        {
          name: "submit_itinerary",
          description: "Submit the full day-by-day itinerary",
          input_schema: {
            type: "object" as const,
            properties: {
              itinerary: {
                type: "object",
                properties: {
                  days: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string" },
                        title: { type: "string" },
                        events: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              time: { type: "string" },
                              endTime: { type: "string" },
                              title: { type: "string" },
                              description: { type: "string" },
                              type: { type: "string" },
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
                  notes: { type: "string" },
                },
                required: ["days", "notes"],
              },
            },
            required: ["itinerary"],
          },
        },
      ],
    };

    return toolMap[type] ?? [];
  }

  // ── Message Builders ──────────────────────────────────

  private buildUserMessage(
    type: AgentTaskType,
    input: Record<string, unknown>,
  ): string {
    const base = `Please analyze the following request and use the appropriate tool to submit your structured response.\n\n`;

    switch (type) {
      case "research_destinations":
        return (
          base +
          `Find the top 5 bachelor party destinations for this group:\n` +
          `- Vibe: ${input.vibe}\n` +
          `- Group Size: ${input.groupSize} people\n` +
          `- Budget: $${input.budget} per person\n` +
          `- Traveling From: ${input.travelFrom}\n` +
          `\nConsider destinations that match the vibe and are feasible from the origin location.`
        );

      case "book_transport":
        return (
          base +
          `Find transport options for this bachelor party group:\n` +
          `- Origin: ${input.origin}\n` +
          `- Destination: ${input.destination}\n` +
          `- Group Size: ${input.groupSize} people\n` +
          `- Dates: ${input.startDate} to ${input.endDate}\n` +
          `\nCompare all viable transport modes with group pricing.`
        );

      case "plan_activities":
        return (
          base +
          `Curate bachelor party activities for this group:\n` +
          `- Destination: ${input.destination}\n` +
          `- Vibe: ${input.vibe}\n` +
          `- Group Size: ${input.groupSize} people\n` +
          `- Budget: $${input.budget} per person for activities\n` +
          `- Duration: ${input.duration} days\n` +
          `\nInclude a mix of adventure, chill, food/drink, and bonding activities.`
        );

      case "generate_itinerary":
        return (
          base +
          `Build a day-by-day itinerary for this bachelor party:\n` +
          `- Destination: ${input.destination}\n` +
          `- Dates: ${input.startDate} to ${input.endDate}\n` +
          `- Group Size: ${input.groupSize} people\n` +
          `- Activities: ${JSON.stringify(input.activities)}\n` +
          `- Transport: ${JSON.stringify(input.transport)}\n` +
          `- Accommodation: ${JSON.stringify(input.accommodation)}\n` +
          `\nOptimize for travel times, meal breaks, and energy levels.`
        );

      default:
        return base + `Task details:\n${JSON.stringify(input, null, 2)}`;
    }
  }

  // ── Helpers ───────────────────────────────────────────

  private addStep(
    workflow: AgentWorkflow,
    name: string,
    description: string,
    status: AgentStatus,
  ): void {
    workflow.steps.push({
      id: generateId("step"),
      name,
      description,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  private completeStep(workflow: AgentWorkflow, stepName: string): void {
    const step = workflow.steps.find(
      (s) => s.name === stepName && s.status === "running",
    );
    if (step) {
      step.status = "completed";
    }
  }

  private extractFallbackResult(
    response: Anthropic.Messages.Message,
  ): Record<string, unknown> {
    const textBlock = response.content.find((block) => block.type === "text");
    return {
      rawText: textBlock && "text" in textBlock ? textBlock.text : "",
    };
  }
}

export default AgentOrchestrator;
