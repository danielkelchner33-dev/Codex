"use client";

import { useState } from "react";
import clsx from "clsx";
import type { RSVPStatus } from "@/models/types";
import { formatDateRange, formatCurrency } from "@/utils/helpers";

// ── Mock Party Info (fetched via invite code in real app) ──────

const MOCK_PARTY_INFO = {
  id: "party_1",
  name: "Dan's Bachelor Party",
  groomName: "Dan Mitchell",
  invitedBy: "Jake Torres",
  destination: "Scottsdale, AZ",
  dates: { start: "2026-06-12", end: "2026-06-15" },
  budgetPerPerson: 900,
  confirmedCount: 4,
  totalInvited: 8,
};

type FormStep = "rsvp" | "submitted";

// ── Component ──────────────────────────────────────────────────

export default function JoinPage() {
  const party = MOCK_PARTY_INFO;

  const [step, setStep] = useState<FormStep>("rsvp");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !rsvpStatus) return;

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setStep("submitted");
    }, 800);
  }

  const rsvpOptions: { value: RSVPStatus; label: string; sublabel: string; color: string; activeColor: string }[] = [
    {
      value: "confirmed",
      label: "I'm In",
      sublabel: "Count me in, let's go!",
      color: "border-zinc-700 hover:border-green-400/50",
      activeColor: "border-green-400 bg-green-400/10",
    },
    {
      value: "maybe",
      label: "Maybe",
      sublabel: "Checking my schedule",
      color: "border-zinc-700 hover:border-yellow-400/50",
      activeColor: "border-yellow-400 bg-yellow-400/10",
    },
    {
      value: "declined",
      label: "Can't Make It",
      sublabel: "Sorry, I'll miss this one",
      color: "border-zinc-700 hover:border-red-400/50",
      activeColor: "border-red-400 bg-red-400/10",
    },
  ];

  // ── RSVP Form ───────────────────────────────────────────────

  if (step === "rsvp") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Party Header */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              StagParty.io
            </p>
            <h1 className="text-3xl font-bold">{party.name}</h1>
            <p className="text-zinc-400 mt-2">
              <span className="text-zinc-300 font-medium">{party.invitedBy}</span>{" "}
              invited you to join the crew
            </p>
          </div>

          {/* Party Details Card */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Destination</p>
                <p className="font-semibold mt-0.5">{party.destination}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Dates</p>
                <p className="font-semibold mt-0.5">
                  {formatDateRange(party.dates.start, party.dates.end)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Budget/Person</p>
                <p className="font-semibold mt-0.5 text-amber-400">
                  {formatCurrency(party.budgetPerPerson)}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">Crew</p>
                <p className="font-semibold mt-0.5">
                  {party.confirmedCount} confirmed / {party.totalInvited} invited
                </p>
              </div>
            </div>
          </div>

          {/* RSVP Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-5"
          >
            <h2 className="text-lg font-bold">RSVP</h2>

            {/* RSVP Status Selection */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-2">
                Are you in?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {rsvpOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRsvpStatus(opt.value)}
                    className={clsx(
                      "rounded-xl border p-4 text-center transition-all",
                      rsvpStatus === opt.value ? opt.activeColor : opt.color,
                      "bg-zinc-800/50"
                    )}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{opt.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@email.com"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                Phone (for SMS updates)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-555-5555"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim() || !email.trim() || !rsvpStatus || submitting}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-bold text-sm py-3 rounded-xl transition-colors"
            >
              {submitting ? "Submitting..." : "Submit RSVP"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Post-RSVP Confirmation ──────────────────────────────────

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        {/* Success State */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 mb-6">
          <div
            className={clsx(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold",
              rsvpStatus === "confirmed" && "bg-green-400/20 text-green-400",
              rsvpStatus === "maybe" && "bg-yellow-400/20 text-yellow-400",
              rsvpStatus === "declined" && "bg-red-400/20 text-red-400"
            )}
          >
            {rsvpStatus === "confirmed" && "!"}
            {rsvpStatus === "maybe" && "?"}
            {rsvpStatus === "declined" && "X"}
          </div>

          <h1 className="text-2xl font-bold mb-2">
            {rsvpStatus === "confirmed" && "You're on the crew!"}
            {rsvpStatus === "maybe" && "We'll keep your spot warm"}
            {rsvpStatus === "declined" && "We'll miss you!"}
          </h1>

          <p className="text-zinc-400">
            {rsvpStatus === "confirmed" &&
              `Welcome aboard, ${name}! ${party.groomName} is going to have the time of his life.`}
            {rsvpStatus === "maybe" &&
              `No worries, ${name}. Let us know when you decide — we'd love to have you.`}
            {rsvpStatus === "declined" &&
              `Understood, ${name}. If things change, you can always update your RSVP.`}
          </p>
        </div>

        {/* Party Details */}
        {rsvpStatus !== "declined" && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-6 text-left">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-4">
              Party Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Destination</span>
                <span className="text-sm font-medium">{party.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Dates</span>
                <span className="text-sm font-medium">
                  {formatDateRange(party.dates.start, party.dates.end)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Budget Per Person</span>
                <span className="text-sm font-medium text-amber-400">
                  {formatCurrency(party.budgetPerPerson)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500">Crew So Far</span>
                <span className="text-sm font-medium">
                  {party.confirmedCount + (rsvpStatus === "confirmed" ? 1 : 0)} confirmed
                </span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href={`/party/${party.id}`}
          className="inline-block bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm px-8 py-3 rounded-xl transition-colors"
        >
          Go to Party Dashboard
        </a>
      </div>
    </div>
  );
}
