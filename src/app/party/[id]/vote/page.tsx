"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { VoteSession, VoteOption, VoteType } from "@/models/types";
import { formatDate } from "@/utils/helpers";

// ── Mock Vote Data ─────────────────────────────────────────────

const MOCK_VOTES: VoteSession[] = [
  {
    id: "v1",
    partyId: "party_1",
    type: "dates",
    title: "Weekend Dates",
    description: "When works best for everyone? Pick your top dates.",
    status: "closed",
    createdAt: "2026-02-20T10:00:00Z",
    closesAt: "2026-03-01T23:59:59Z",
    options: [
      { id: "d1", label: "Jun 12–15", description: "Friday–Monday" },
      { id: "d2", label: "Jun 19–22", description: "Friday–Monday" },
      { id: "d3", label: "Jun 26–29", description: "Friday–Monday" },
    ],
    results: {
      winner: { id: "d1", label: "Jun 12–15", description: "Friday–Monday" },
      tallies: [
        { optionId: "d1", count: 5, percentage: 56 },
        { optionId: "d2", count: 3, percentage: 33 },
        { optionId: "d3", count: 1, percentage: 11 },
      ],
      totalVotes: 9,
    },
  },
  {
    id: "v2",
    partyId: "party_1",
    type: "destination",
    title: "Destination Vote",
    description: "Where are we sending Dan off? Rank your top picks.",
    status: "open",
    createdAt: "2026-03-01T10:00:00Z",
    closesAt: "2026-03-25T23:59:59Z",
    options: [
      {
        id: "dest1",
        label: "Scottsdale, AZ",
        description: "Desert vibes, golf, pool parties & nightlife",
        imageUrl: "/destinations/scottsdale.jpg",
        metadata: { estimatedCost: 850 },
      },
      {
        id: "dest2",
        label: "Nashville, TN",
        description: "Live music, Broadway honky-tonks & BBQ",
        imageUrl: "/destinations/nashville.jpg",
        metadata: { estimatedCost: 750 },
      },
      {
        id: "dest3",
        label: "Austin, TX",
        description: "6th Street, lake life & tacos",
        imageUrl: "/destinations/austin.jpg",
        metadata: { estimatedCost: 700 },
      },
      {
        id: "dest4",
        label: "Miami, FL",
        description: "South Beach, clubs & deep-sea fishing",
        imageUrl: "/destinations/miami.jpg",
        metadata: { estimatedCost: 1100 },
      },
    ],
    results: {
      winner: {
        id: "dest1",
        label: "Scottsdale, AZ",
        description: "Desert vibes, golf, pool parties & nightlife",
      },
      tallies: [
        { optionId: "dest1", count: 4, percentage: 40 },
        { optionId: "dest2", count: 3, percentage: 30 },
        { optionId: "dest3", count: 2, percentage: 20 },
        { optionId: "dest4", count: 1, percentage: 10 },
      ],
      totalVotes: 10,
    },
  },
  {
    id: "v3",
    partyId: "party_1",
    type: "budget",
    title: "Budget Tier",
    description: "What's everyone comfortable spending per person?",
    status: "open",
    createdAt: "2026-03-10T10:00:00Z",
    closesAt: "2026-03-28T23:59:59Z",
    options: [
      { id: "b1", label: "Budget", description: "Under $500 — keep it lean", metadata: { tier: "budget", amount: 500 } },
      { id: "b2", label: "Moderate", description: "$500–$900 — solid weekend", metadata: { tier: "moderate", amount: 900 } },
      { id: "b3", label: "Premium", description: "$900–$1,500 — go big", metadata: { tier: "premium", amount: 1500 } },
      { id: "b4", label: "Baller", description: "$1,500+ — no limits", metadata: { tier: "baller", amount: 2000 } },
    ],
    results: {
      winner: { id: "b2", label: "Moderate", description: "$500–$900 — solid weekend" },
      tallies: [
        { optionId: "b2", count: 4, percentage: 44 },
        { optionId: "b3", count: 3, percentage: 33 },
        { optionId: "b1", count: 1, percentage: 11 },
        { optionId: "b4", count: 1, percentage: 11 },
      ],
      totalVotes: 9,
    },
  },
  {
    id: "v4",
    partyId: "party_1",
    type: "activity",
    title: "Activity Check — Skydiving",
    description: "Would the crew be down for tandem skydiving?",
    status: "open",
    createdAt: "2026-03-15T10:00:00Z",
    closesAt: "2026-03-30T23:59:59Z",
    options: [
      { id: "act_y", label: "Hell Yes", description: "Let's do it" },
      { id: "act_n", label: "Nah", description: "Hard pass" },
    ],
    results: {
      winner: { id: "act_y", label: "Hell Yes", description: "Let's do it" },
      tallies: [
        { optionId: "act_y", count: 5, percentage: 63 },
        { optionId: "act_n", count: 3, percentage: 37 },
      ],
      totalVotes: 8,
    },
  },
];

// ── Badge Colors by Vote Type ──────────────────────────────────

const TYPE_STYLES: Record<VoteType, { bg: string; text: string }> = {
  dates: { bg: "bg-blue-500/20", text: "text-blue-400" },
  destination: { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  budget: { bg: "bg-amber-500/20", text: "text-amber-400" },
  activity: { bg: "bg-purple-500/20", text: "text-purple-400" },
  accommodation: { bg: "bg-pink-500/20", text: "text-pink-400" },
  transport: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  custom: { bg: "bg-zinc-500/20", text: "text-zinc-400" },
};

const BUDGET_TIER_ICONS: Record<string, string> = {
  budget: "$",
  moderate: "$$",
  premium: "$$$",
  baller: "$$$$",
};

// ── Component ──────────────────────────────────────────────────

export default function VoteHubPage() {
  const [votes, setVotes] = useState<VoteSession[]>(MOCK_VOTES);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [rankedOptions, setRankedOptions] = useState<Record<string, string[]>>({});
  const [showNewVoteForm, setShowNewVoteForm] = useState(false);
  const [newVote, setNewVote] = useState({ title: "", description: "", type: "custom" as VoteType });
  const isBestMan = true; // mock: current user is best man

  function handleSelectOption(voteId: string, optionId: string) {
    setSelectedOptions((prev) => {
      const current = prev[voteId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [voteId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [voteId]: [...current, optionId] };
    });
  }

  function handleRankOption(voteId: string, optionId: string) {
    setRankedOptions((prev) => {
      const current = prev[voteId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [voteId]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [voteId]: [...current, optionId] };
    });
  }

  function handleLockVote(voteId: string) {
    setVotes((prev) =>
      prev.map((v) => (v.id === voteId ? { ...v, status: "closed" as const } : v))
    );
  }

  function handleCreateVote() {
    const vote: VoteSession = {
      id: `v_new_${Date.now()}`,
      partyId: "party_1",
      type: newVote.type,
      title: newVote.title,
      description: newVote.description,
      status: "open",
      createdAt: new Date().toISOString(),
      closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      options: [],
    };
    setVotes((prev) => [vote, ...prev]);
    setNewVote({ title: "", description: "", type: "custom" });
    setShowNewVoteForm(false);
  }

  // ── Render helpers ──────────────────────────────────────────

  function renderProgressBar(optionId: string, count: number, percentage: number, total: number) {
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
          <span>{count} votes</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  function renderDateOptions(vote: VoteSession) {
    const selected = selectedOptions[vote.id] || [];
    return (
      <div className="grid grid-cols-3 gap-3">
        {vote.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const tally = vote.results?.tallies.find((t) => t.optionId === opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => vote.status === "open" && handleSelectOption(vote.id, opt.id)}
              disabled={vote.status === "closed"}
              className={clsx(
                "rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
                vote.status === "closed" && "opacity-70 cursor-default"
              )}
            >
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-zinc-500">{opt.description}</p>
              {tally && renderProgressBar(opt.id, tally.count, tally.percentage, vote.results!.totalVotes)}
            </button>
          );
        })}
      </div>
    );
  }

  function renderDestinationOptions(vote: VoteSession) {
    const ranked = rankedOptions[vote.id] || [];
    return (
      <div>
        <p className="text-xs text-zinc-500 mb-3">
          Click destinations in order of preference (1st = top pick)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vote.options.map((opt) => {
            const rankIndex = ranked.indexOf(opt.id);
            const isRanked = rankIndex !== -1;
            const tally = vote.results?.tallies.find((t) => t.optionId === opt.id);
            const cost = opt.metadata?.estimatedCost as number | undefined;
            return (
              <button
                key={opt.id}
                onClick={() => vote.status === "open" && handleRankOption(vote.id, opt.id)}
                disabled={vote.status === "closed"}
                className={clsx(
                  "rounded-xl border overflow-hidden text-left transition-all relative",
                  isRanked
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
                  vote.status === "closed" && "opacity-70 cursor-default"
                )}
              >
                {/* Image placeholder */}
                <div className="h-28 bg-zinc-700 flex items-center justify-center text-zinc-500 text-xs">
                  {opt.imageUrl ? opt.label : "No Image"}
                </div>
                {/* Rank badge */}
                {isRanked && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-amber-400 text-zinc-900 font-bold text-sm flex items-center justify-center">
                    {rankIndex + 1}
                  </div>
                )}
                <div className="p-4">
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{opt.description}</p>
                  {cost && (
                    <p className="text-xs text-amber-400 mt-1 font-medium">
                      ~${cost}/person
                    </p>
                  )}
                  {tally && renderProgressBar(opt.id, tally.count, tally.percentage, vote.results!.totalVotes)}
                </div>
              </button>
            );
          })}
        </div>
        {ranked.length > 0 && vote.status === "open" && (
          <div className="mt-4 bg-zinc-800/50 rounded-xl p-3">
            <p className="text-xs text-zinc-400 mb-2 font-semibold">Your Ranking:</p>
            <div className="flex gap-2 flex-wrap">
              {ranked.map((id, i) => {
                const opt = vote.options.find((o) => o.id === id);
                return (
                  <span
                    key={id}
                    className="text-xs bg-amber-400/20 text-amber-400 px-3 py-1 rounded-full font-medium"
                  >
                    #{i + 1} {opt?.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderBudgetOptions(vote: VoteSession) {
    const selected = selectedOptions[vote.id] || [];
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vote.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const tier = (opt.metadata?.tier as string) || "custom";
          const tally = vote.results?.tallies.find((t) => t.optionId === opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => vote.status === "open" && handleSelectOption(vote.id, opt.id)}
              disabled={vote.status === "closed"}
              className={clsx(
                "rounded-xl border p-4 text-center transition-all",
                isSelected
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
                vote.status === "closed" && "opacity-70 cursor-default"
              )}
            >
              <p className="text-2xl font-bold text-amber-400 mb-1">
                {BUDGET_TIER_ICONS[tier] ?? "$"}
              </p>
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{opt.description}</p>
              {tally && renderProgressBar(opt.id, tally.count, tally.percentage, vote.results!.totalVotes)}
            </button>
          );
        })}
      </div>
    );
  }

  function renderActivityOptions(vote: VoteSession) {
    const selected = selectedOptions[vote.id] || [];
    return (
      <div className="flex gap-4 justify-center">
        {vote.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isYes = opt.label.toLowerCase().includes("yes");
          const tally = vote.results?.tallies.find((t) => t.optionId === opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => vote.status === "open" && handleSelectOption(vote.id, opt.id)}
              disabled={vote.status === "closed"}
              className={clsx(
                "rounded-xl border px-8 py-6 text-center transition-all min-w-[140px]",
                isSelected && isYes && "border-green-400 bg-green-400/10",
                isSelected && !isYes && "border-red-400 bg-red-400/10",
                !isSelected && "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
                vote.status === "closed" && "opacity-70 cursor-default"
              )}
            >
              <p className="text-3xl mb-2">{isYes ? "👍" : "👎"}</p>
              <p className="font-semibold">{opt.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{opt.description}</p>
              {tally && renderProgressBar(opt.id, tally.count, tally.percentage, vote.results!.totalVotes)}
            </button>
          );
        })}
      </div>
    );
  }

  function renderDefaultOptions(vote: VoteSession) {
    const selected = selectedOptions[vote.id] || [];
    return (
      <div className="grid grid-cols-2 gap-3">
        {vote.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const tally = vote.results?.tallies.find((t) => t.optionId === opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => vote.status === "open" && handleSelectOption(vote.id, opt.id)}
              disabled={vote.status === "closed"}
              className={clsx(
                "rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
                vote.status === "closed" && "opacity-70 cursor-default"
              )}
            >
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-zinc-500">{opt.description}</p>
              {tally && renderProgressBar(opt.id, tally.count, tally.percentage, vote.results!.totalVotes)}
            </button>
          );
        })}
      </div>
    );
  }

  function renderOptions(vote: VoteSession) {
    switch (vote.type) {
      case "dates":
        return renderDateOptions(vote);
      case "destination":
        return renderDestinationOptions(vote);
      case "budget":
        return renderBudgetOptions(vote);
      case "activity":
        return renderActivityOptions(vote);
      default:
        return renderDefaultOptions(vote);
    }
  }

  // ── Main Render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/party/party_1"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-1">Voting Hub</h1>
          </div>
          {isBestMan && (
            <button
              onClick={() => setShowNewVoteForm(true)}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
            >
              + New Vote
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        {/* New Vote Form */}
        {showNewVoteForm && (
          <div className="bg-zinc-900 rounded-2xl border border-amber-400/30 p-6">
            <h2 className="text-lg font-bold mb-4">Create New Vote</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newVote.title}
                  onChange={(e) => setNewVote((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Activity Vote — Go-Karts?"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newVote.description}
                  onChange={(e) => setNewVote((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of this vote"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Vote Type
                </label>
                <select
                  value={newVote.type}
                  onChange={(e) => setNewVote((p) => ({ ...p, type: e.target.value as VoteType }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-400/50"
                >
                  <option value="dates">Date</option>
                  <option value="destination">Destination</option>
                  <option value="budget">Budget</option>
                  <option value="activity">Activity</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="transport">Transport</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateVote}
                  disabled={!newVote.title.trim()}
                  className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  Create Vote
                </button>
                <button
                  onClick={() => setShowNewVoteForm(false)}
                  className="text-zinc-400 hover:text-zinc-200 text-sm px-4 py-2.5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vote Cards */}
        {votes.map((vote) => {
          const style = TYPE_STYLES[vote.type] || TYPE_STYLES.custom;
          return (
            <section
              key={vote.id}
              className={clsx(
                "bg-zinc-900 rounded-2xl border p-6",
                vote.status === "open" ? "border-zinc-800" : "border-zinc-800/60"
              )}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={clsx(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        style.bg,
                        style.text
                      )}
                    >
                      {vote.type}
                    </span>
                    <span
                      className={clsx(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                        vote.status === "open"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-zinc-700/40 text-zinc-500"
                      )}
                    >
                      {vote.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{vote.title}</h3>
                  <p className="text-sm text-zinc-400 mt-0.5">{vote.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {vote.results && (
                    <p className="text-xs text-zinc-500">
                      {vote.results.totalVotes} votes cast
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {vote.status === "open" ? "Closes" : "Closed"}{" "}
                    {formatDate(vote.closesAt)}
                  </p>
                </div>
              </div>

              {/* Options */}
              {renderOptions(vote)}

              {/* Best Man Controls */}
              {isBestMan && vote.status === "open" && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end">
                  <button
                    onClick={() => handleLockVote(vote.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg transition-colors"
                  >
                    Lock &amp; Close Vote
                  </button>
                </div>
              )}

              {/* Winner Badge */}
              {vote.status === "closed" && vote.results && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-sm font-bold">Winner:</span>
                    <span className="bg-amber-400/20 text-amber-400 text-sm font-semibold px-3 py-1 rounded-full">
                      {vote.results.winner.label}
                    </span>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
