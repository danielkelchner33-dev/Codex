"use client";

import { useState } from "react";
import clsx from "clsx";
import type {
  BachelorParty,
  AgentWorkflow,
  PartnerDeal,
} from "@/models/types";
import {
  formatCurrency,
  formatDateRange,
  getDaysBetween,
  getConfirmedCount,
} from "@/utils/helpers";

// ── Mock Data ──────────────────────────────────────────────────

const MOCK_PARTY: BachelorParty = {
  id: "party_1",
  name: "Dan's Bachelor Party",
  groomName: "Dan Mitchell",
  bestManName: "Jake Torres",
  createdAt: "2026-02-15T10:00:00Z",
  status: "planning",
  inviteCode: "stag-epic-421",
  destination: {
    id: "dest_1",
    name: "Scottsdale, AZ",
    description: "Desert vibes, golf, pool parties, and nightlife.",
    type: "city",
    location: { city: "Scottsdale", state: "AZ", lat: 33.49, lng: -111.93 },
    estimatedCostPerPerson: 850,
    highlights: ["Old Town nightlife", "TPC Golf", "Pool clubs"],
    imageUrl: "/destinations/scottsdale.jpg",
  },
  dates: { start: "2026-06-12", end: "2026-06-15", flexibleDays: 0 },
  budget: {
    totalPerPerson: 900,
    breakdown: {
      transportation: 200,
      accommodation: 300,
      activities: 150,
      food: 120,
      drinks: 100,
      misc: 30,
    },
    groomPaysNothing: true,
    paymentDeadline: "2026-05-01",
    venmoHandle: "@jake-torres",
    splitMethod: "equal",
  },
  itinerary: null,
  attendees: [
    { id: "a1", name: "Dan Mitchell", email: "dan@email.com", role: "groom", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-15" },
    { id: "a2", name: "Jake Torres", email: "jake@email.com", role: "best_man", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-15" },
    { id: "a3", name: "Mike Chen", email: "mike@email.com", role: "groomsman", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-18" },
    { id: "a4", name: "Ryan Brooks", email: "ryan@email.com", role: "groomsman", rsvpStatus: "confirmed", hasVoted: false, joinedAt: "2026-02-20" },
    { id: "a5", name: "Alex Patel", email: "alex@email.com", role: "groomsman", rsvpStatus: "maybe", hasVoted: false, joinedAt: "2026-02-22" },
    { id: "a6", name: "Chris Evans", email: "chris@email.com", role: "guest", rsvpStatus: "pending", hasVoted: false },
    { id: "a7", name: "Sam Wilson", email: "sam@email.com", role: "guest", rsvpStatus: "declined", hasVoted: false },
  ],
  votes: [],
  agentWorkflows: [
    {
      id: "wf_1",
      partyId: "party_1",
      type: "research_destinations",
      status: "completed",
      input: { preferences: ["golf", "nightlife"] },
      output: { destinations: 5 },
      steps: [
        { id: "s1", name: "Gathering preferences", description: "", status: "completed", timestamp: "2026-02-16T10:00:00Z" },
        { id: "s2", name: "Researching destinations", description: "", status: "completed", timestamp: "2026-02-16T10:05:00Z" },
      ],
      createdAt: "2026-02-16T10:00:00Z",
      completedAt: "2026-02-16T10:10:00Z",
    },
    {
      id: "wf_2",
      partyId: "party_1",
      type: "find_accommodations",
      status: "running",
      input: { destination: "Scottsdale" },
      steps: [
        { id: "s3", name: "Searching hotels", description: "", status: "completed", timestamp: "2026-03-20T09:00:00Z" },
        { id: "s4", name: "Comparing prices", description: "", status: "running", timestamp: "2026-03-20T09:02:00Z" },
      ],
      createdAt: "2026-03-20T09:00:00Z",
    },
    {
      id: "wf_3",
      partyId: "party_1",
      type: "find_partner_deals",
      status: "queued",
      input: { destination: "Scottsdale" },
      steps: [],
      createdAt: "2026-03-20T10:00:00Z",
    },
  ],
  partnerDeals: [
    {
      id: "pd_1", partnerName: "TopGolf Scottsdale", partnerType: "activity_provider",
      dealTitle: "20% Off Group Booking", description: "Book for 6+ and save 20% on bays and food packages.",
      discountPercent: 20, affiliateUrl: "#", commission: 8, validUntil: "2026-07-01",
      destination: "Scottsdale", category: "activity",
    },
    {
      id: "pd_2", partnerName: "W Scottsdale", partnerType: "hotel",
      dealTitle: "$50 Off Per Night", description: "Bachelor party special — pool cabana access included.",
      discountFlat: 50, affiliateUrl: "#", commission: 10, validUntil: "2026-08-01",
      destination: "Scottsdale", category: "accommodation",
    },
    {
      id: "pd_3", partnerName: "Bottled Blonde", partnerType: "bar",
      dealTitle: "Free Bottle Service Setup", description: "Complimentary table setup when you reserve bottle service.",
      affiliateUrl: "#", commission: 12, validUntil: "2026-06-30",
      destination: "Scottsdale", category: "drinks",
    },
  ],
};

// ── Progress Steps ─────────────────────────────────────────────

const STEPS = [
  "Invite Crew",
  "Vote on Dates",
  "Choose Destination",
  "Set Budget",
  "Build Itinerary",
  "Book Everything",
];

function getCompletedStepCount(party: BachelorParty): number {
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
  return checks.filter(Boolean).length;
}

// ── Helpers ────────────────────────────────────────────────────

const AGENT_LABELS: Record<string, string> = {
  research_destinations: "Researching Destinations",
  find_accommodations: "Finding Accommodations",
  book_transport: "Booking Transport",
  plan_activities: "Planning Activities",
  compare_prices: "Comparing Prices",
  send_reminders: "Sending Reminders",
  collect_payments: "Collecting Payments",
  generate_itinerary: "Generating Itinerary",
  coordinate_logistics: "Coordinating Logistics",
  find_partner_deals: "Finding Partner Deals",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "text-green-400",
  running: "text-amber-400",
  queued: "text-zinc-500",
  waiting_input: "text-blue-400",
  failed: "text-red-400",
};

// ── Component ──────────────────────────────────────────────────

export default function PartyDashboard() {
  const party = MOCK_PARTY;
  const completedSteps = getCompletedStepCount(party);
  const confirmed = getConfirmedCount(party);
  const daysUntil = party.dates
    ? getDaysBetween(new Date().toISOString(), party.dates.start)
    : null;
  const [dealIndex, setDealIndex] = useState(0);

  const navSections = [
    { label: "Voting Hub", href: `/party/${party.id}/vote`, icon: "🗳", description: "Vote on dates, destinations & activities" },
    { label: "Itinerary", href: `/party/${party.id}/itinerary`, icon: "📋", description: "View and build the weekend schedule" },
    { label: "Budget", href: `/party/${party.id}/budget`, icon: "💰", description: "Track costs and collect payments" },
    { label: "Crew", href: `/party/${party.id}/crew`, icon: "👥", description: "Manage attendees and invites" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              StagParty.io
            </p>
            <h1 className="text-2xl font-bold mt-1">{party.name}</h1>
          </div>
          <span
            className={clsx(
              "text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide",
              party.status === "planning" && "bg-amber-400/20 text-amber-400",
              party.status === "voting" && "bg-blue-400/20 text-blue-400",
              party.status === "booked" && "bg-green-400/20 text-green-400",
              party.status === "draft" && "bg-zinc-700/40 text-zinc-400"
            )}
          >
            {party.status}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* ── Progress Tracker ─────────────────────────────────── */}
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Planning Progress
          </h2>
          <div className="flex items-center gap-2">
            {STEPS.map((step, i) => {
              const done = i < completedSteps;
              const current = i === completedSteps;
              return (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                        done && "bg-amber-400 border-amber-400 text-zinc-900",
                        current && "border-amber-400 text-amber-400 bg-amber-400/10",
                        !done && !current && "border-zinc-700 text-zinc-600 bg-zinc-800"
                      )}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      className={clsx(
                        "text-[10px] mt-1 text-center leading-tight",
                        done && "text-amber-400",
                        current && "text-zinc-200",
                        !done && !current && "text-zinc-600"
                      )}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={clsx(
                        "h-0.5 flex-1 mt-[-18px]",
                        i < completedSteps ? "bg-amber-400" : "bg-zinc-800"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quick Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Confirmed Attendees
            </p>
            <p className="text-3xl font-bold text-amber-400">
              {confirmed}
              <span className="text-base text-zinc-500 ml-1">
                / {party.attendees.length}
              </span>
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Budget Per Person
            </p>
            <p className="text-3xl font-bold text-amber-400">
              {party.budget ? formatCurrency(party.budget.totalPerPerson) : "—"}
            </p>
          </div>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
              Days Until Party
            </p>
            <p className="text-3xl font-bold text-amber-400">
              {daysUntil !== null ? daysUntil : "—"}
            </p>
            {party.dates && (
              <p className="text-xs text-zinc-500 mt-1">
                {formatDateRange(party.dates.start, party.dates.end)}
              </p>
            )}
          </div>
        </div>

        {/* ── Section Links ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {navSections.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="group bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:border-amber-400/50 transition-colors"
            >
              <span className="text-2xl">{s.icon}</span>
              <h3 className="text-lg font-semibold mt-2 group-hover:text-amber-400 transition-colors">
                {s.label}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">{s.description}</p>
            </a>
          ))}
        </div>

        {/* ── AI Agent Status Panel ────────────────────────────── */}
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            AI Agent Workflows
          </h2>
          <div className="space-y-3">
            {party.agentWorkflows.map((wf: AgentWorkflow) => (
              <div
                key={wf.id}
                className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "w-2.5 h-2.5 rounded-full",
                      wf.status === "completed" && "bg-green-400",
                      wf.status === "running" && "bg-amber-400 animate-pulse",
                      wf.status === "queued" && "bg-zinc-600",
                      wf.status === "waiting_input" && "bg-blue-400 animate-pulse",
                      wf.status === "failed" && "bg-red-400"
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {AGENT_LABELS[wf.type] ?? wf.type}
                    </p>
                    {wf.steps.length > 0 && (
                      <p className="text-xs text-zinc-500">
                        Step {wf.steps.filter((s) => s.status === "completed").length}
                        /{wf.steps.length}
                        {" — "}
                        {wf.steps[wf.steps.length - 1].name}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={clsx(
                    "text-xs font-semibold uppercase tracking-wide",
                    STATUS_COLORS[wf.status]
                  )}
                >
                  {wf.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Partner Deals Carousel ───────────────────────────── */}
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Partner Deals
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setDealIndex((prev) =>
                    prev === 0 ? party.partnerDeals.length - 1 : prev - 1
                  )
                }
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-sm transition-colors"
              >
                &larr;
              </button>
              <button
                onClick={() =>
                  setDealIndex((prev) =>
                    prev === party.partnerDeals.length - 1 ? 0 : prev + 1
                  )
                }
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-sm transition-colors"
              >
                &rarr;
              </button>
            </div>
          </div>
          {party.partnerDeals.length > 0 && (
            <div className="bg-zinc-800/50 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide">
                  {party.partnerDeals[dealIndex].partnerName}
                </p>
                <h3 className="text-lg font-bold mt-1">
                  {party.partnerDeals[dealIndex].dealTitle}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {party.partnerDeals[dealIndex].description}
                </p>
              </div>
              <a
                href={party.partnerDeals[dealIndex].affiliateUrl}
                className="shrink-0 bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Claim Deal
              </a>
            </div>
          )}
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {party.partnerDeals.map((_, i) => (
              <button
                key={i}
                onClick={() => setDealIndex(i)}
                className={clsx(
                  "w-2 h-2 rounded-full transition-colors",
                  i === dealIndex ? "bg-amber-400" : "bg-zinc-700"
                )}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
