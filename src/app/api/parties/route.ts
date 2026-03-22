import { NextResponse } from "next/server";
import { mockParty } from "@/data/mock";
import { generateId, generateInviteCode } from "@/utils/helpers";

// GET /api/parties — list parties (demo: returns mock)
export async function GET() {
  return NextResponse.json({ parties: [mockParty] });
}

// POST /api/parties — create new party
export async function POST(request: Request) {
  const body = await request.json();

  const party = {
    id: generateId("party"),
    name: `${body.groomName}'s Bachelor Party`,
    groomName: body.groomName,
    bestManName: body.bestManName,
    createdAt: new Date().toISOString(),
    status: "draft" as const,
    inviteCode: generateInviteCode(),
    destination: null,
    dates: null,
    budget: null,
    itinerary: null,
    attendees: [
      {
        id: generateId("att"),
        name: body.bestManName,
        email: body.bestManEmail,
        phone: body.bestManPhone,
        role: "best_man" as const,
        rsvpStatus: "confirmed" as const,
        joinedAt: new Date().toISOString(),
        hasVoted: false,
      },
      {
        id: generateId("att"),
        name: body.groomName,
        email: "",
        role: "groom" as const,
        rsvpStatus: "confirmed" as const,
        joinedAt: new Date().toISOString(),
        hasVoted: false,
      },
    ],
    votes: [],
    agentWorkflows: [],
    partnerDeals: [],
  };

  // In production: save to database
  return NextResponse.json({ party }, { status: 201 });
}
