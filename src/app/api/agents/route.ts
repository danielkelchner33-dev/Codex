import { NextResponse } from "next/server";
import { generateId } from "@/utils/helpers";
import type { AgentTaskType } from "@/models/types";

// POST /api/agents — trigger an agent workflow
export async function POST(request: Request) {
  const body = await request.json();

  const workflow = {
    id: generateId("wf"),
    partyId: body.partyId,
    type: body.type as AgentTaskType,
    status: "queued" as const,
    input: body.input || {},
    steps: [],
    createdAt: new Date().toISOString(),
  };

  // In production: queue the agent workflow and stream results
  // For demo: return the workflow ID for status polling
  return NextResponse.json({ workflow }, { status: 201 });
}

// GET /api/agents?workflowId=xxx — check workflow status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get("workflowId");

  if (!workflowId) {
    return NextResponse.json({ error: "workflowId required" }, { status: 400 });
  }

  // Demo: return a mock completed workflow
  const workflow = {
    id: workflowId,
    status: "completed",
    steps: [
      {
        id: generateId("step"),
        name: "Research",
        description: "Gathering information...",
        status: "completed",
        timestamp: new Date().toISOString(),
      },
      {
        id: generateId("step"),
        name: "Analysis",
        description: "Comparing options...",
        status: "completed",
        timestamp: new Date().toISOString(),
      },
      {
        id: generateId("step"),
        name: "Results",
        description: "Preparing recommendations...",
        status: "completed",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return NextResponse.json({ workflow });
}
