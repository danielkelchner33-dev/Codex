import { NextResponse } from "next/server";
import { mockVoteSessions } from "@/data/mock";
import { generateId } from "@/utils/helpers";
import type { VoteCast, VoteType } from "@/models/types";

// GET /api/votes?partyId=xxx — get vote sessions for a party
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const partyId = searchParams.get("partyId");

  // Demo: return mock votes
  const votes = partyId
    ? mockVoteSessions.filter((v) => v.partyId === partyId)
    : mockVoteSessions;

  return NextResponse.json({ votes });
}

// POST /api/votes — create new vote session or cast a vote
export async function POST(request: Request) {
  const body = await request.json();

  if (body.action === "cast") {
    // Cast a vote
    const vote: VoteCast = {
      attendeeId: body.attendeeId,
      optionId: body.optionId,
      rank: body.rank,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json({ vote, success: true });
  }

  // Create new vote session
  const session = {
    id: generateId("vote"),
    partyId: body.partyId,
    type: body.type as VoteType,
    title: body.title,
    description: body.description,
    options: body.options.map((opt: { label: string; description: string }) => ({
      id: generateId("opt"),
      label: opt.label,
      description: opt.description,
    })),
    status: "open" as const,
    createdAt: new Date().toISOString(),
    closesAt: body.closesAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json({ session }, { status: 201 });
}
