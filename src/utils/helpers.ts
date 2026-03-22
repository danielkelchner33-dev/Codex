// ============================================================
// StagParty.io — Utility Helpers
// ============================================================

import type {
  Attendee,
  BachelorParty,
  BudgetBreakdown,
  VoteCast,
  VoteOption,
  VoteResults,
  VoteSession,
} from "../models/types";

// ── ID Generation ───────────────────────────────────────────

export function generateId(prefix = ""): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}_${id}` : id;
}

export function generateInviteCode(): string {
  const words = ["stag", "party", "send", "off", "epic", "crew", "wild", "last", "hurrah"];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 999);
  return `${w1}-${w2}-${num}`;
}

// ── Date Helpers ────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateRange(start: string, end: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function getDaysBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

// ── Budget Helpers ──────────────────────────────────────────

export function calculateTotalBudget(
  breakdown: BudgetBreakdown
): number {
  return Object.values(breakdown).reduce((sum, val) => sum + val, 0);
}

export function splitCostPerPerson(
  total: number,
  attendees: Attendee[],
  groomPaysNothing: boolean
): number {
  const paying = attendees.filter(
    (a) => a.rsvpStatus === "confirmed" && (!groomPaysNothing || a.role !== "groom")
  );
  if (paying.length === 0) return 0;
  return Math.ceil(total / paying.length);
}

// ── Vote Tallying ───────────────────────────────────────────

export function tallyVotes(
  session: VoteSession,
  votes: VoteCast[]
): VoteResults {
  const counts = new Map<string, number>();
  for (const opt of session.options) {
    counts.set(opt.id, 0);
  }
  for (const v of votes) {
    counts.set(v.optionId, (counts.get(v.optionId) || 0) + 1);
  }

  const totalVotes = votes.length;
  const tallies = session.options.map((opt) => ({
    optionId: opt.id,
    count: counts.get(opt.id) || 0,
    percentage: totalVotes > 0 ? Math.round(((counts.get(opt.id) || 0) / totalVotes) * 100) : 0,
  }));

  tallies.sort((a, b) => b.count - a.count);

  const winnerOption =
    session.options.find((o) => o.id === tallies[0]?.optionId) || session.options[0];

  return { winner: winnerOption, tallies, totalVotes };
}

// ── Party Helpers ───────────────────────────────────────────

export function getConfirmedCount(party: BachelorParty): number {
  return party.attendees.filter((a) => a.rsvpStatus === "confirmed").length;
}

export function getPartyProgress(party: BachelorParty): {
  step: string;
  percent: number;
} {
  const checks = [
    party.attendees.length > 1,
    party.dates !== null,
    party.destination !== null,
    party.budget !== null,
    party.itinerary !== null,
    party.itinerary?.days.some((d) =>
      d.events.some((e) => e.bookingStatus === "confirmed")
    ),
  ];
  const done = checks.filter(Boolean).length;
  const steps = [
    "Invite the crew",
    "Lock in dates",
    "Choose destination",
    "Set budget",
    "Build itinerary",
    "Book everything",
  ];
  const percent = Math.round((done / checks.length) * 100);
  return { step: steps[done] || "All set!", percent };
}

// ── Currency Formatting ─────────────────────────────────────

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
