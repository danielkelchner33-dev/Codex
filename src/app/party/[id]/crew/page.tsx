"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { Attendee, AttendeeRole, RSVPStatus } from "@/models/types";
import { generateId } from "@/utils/helpers";

// ── Mock Attendee Data ─────────────────────────────────────────

const MOCK_ATTENDEES: Attendee[] = [
  { id: "a1", name: "Dan Mitchell", email: "dan@email.com", phone: "+15551234567", role: "groom", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-15" },
  { id: "a2", name: "Jake Torres", email: "jake@email.com", phone: "+15559876543", role: "best_man", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-15" },
  { id: "a3", name: "Mike Chen", email: "mike@email.com", phone: "+15555550101", role: "groomsman", rsvpStatus: "confirmed", hasVoted: true, joinedAt: "2026-02-18" },
  { id: "a4", name: "Ryan Brooks", email: "ryan@email.com", role: "groomsman", rsvpStatus: "confirmed", hasVoted: false, joinedAt: "2026-02-20" },
  { id: "a5", name: "Alex Patel", email: "alex@email.com", role: "groomsman", rsvpStatus: "maybe", hasVoted: false, joinedAt: "2026-02-22" },
  { id: "a6", name: "Chris Evans", email: "chris@email.com", role: "guest", rsvpStatus: "pending", hasVoted: false },
  { id: "a7", name: "Sam Wilson", email: "sam@email.com", role: "guest", rsvpStatus: "declined", hasVoted: false, joinedAt: "2026-02-25" },
  { id: "a8", name: "Tom Hardy", email: "tom@email.com", role: "guest", rsvpStatus: "pending", hasVoted: false },
];

const INVITE_CODE = "stag-epic-421";

// ── RSVP Badge Styles ──────────────────────────────────────────

const RSVP_STYLES: Record<RSVPStatus, { bg: string; text: string; label: string }> = {
  confirmed: { bg: "bg-green-500/20", text: "text-green-400", label: "Confirmed" },
  maybe: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Maybe" },
  pending: { bg: "bg-zinc-500/20", text: "text-zinc-400", label: "Pending" },
  declined: { bg: "bg-red-500/20", text: "text-red-400", label: "Declined" },
};

const ROLE_STYLES: Record<AttendeeRole, { bg: string; text: string; label: string } | null> = {
  groom: { bg: "bg-amber-400/20", text: "text-amber-400", label: "Groom" },
  best_man: { bg: "bg-purple-400/20", text: "text-purple-400", label: "Best Man" },
  groomsman: null,
  guest: null,
};

// ── Component ──────────────────────────────────────────────────

export default function CrewPage() {
  const [attendees, setAttendees] = useState<Attendee[]>(MOCK_ATTENDEES);
  const [copied, setCopied] = useState(false);
  const [reminderSent, setReminderSent] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAttendee, setNewAttendee] = useState({ name: "", email: "", phone: "" });

  const inviteLink = `https://stagparty.io/join/${INVITE_CODE}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleSendReminder(attendeeId: string) {
    setReminderSent((prev) => ({ ...prev, [attendeeId]: true }));
    // In a real app this would trigger an SMS via API
  }

  function handleAddAttendee(e: React.FormEvent) {
    e.preventDefault();
    if (!newAttendee.name.trim() || !newAttendee.email.trim()) return;

    const attendee: Attendee = {
      id: generateId("att"),
      name: newAttendee.name.trim(),
      email: newAttendee.email.trim(),
      phone: newAttendee.phone.trim() || undefined,
      role: "guest",
      rsvpStatus: "pending",
      hasVoted: false,
    };

    setAttendees((prev) => [...prev, attendee]);
    setNewAttendee({ name: "", email: "", phone: "" });
    setShowAddForm(false);
  }

  const confirmedCount = attendees.filter((a) => a.rsvpStatus === "confirmed").length;
  const maybeCount = attendees.filter((a) => a.rsvpStatus === "maybe").length;
  const pendingCount = attendees.filter((a) => a.rsvpStatus === "pending").length;
  const declinedCount = attendees.filter((a) => a.rsvpStatus === "declined").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/party/party_1"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold mt-1">The Crew</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            + Add Attendee
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* ── Quick Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{confirmedCount}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Confirmed</p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">{maybeCount}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Maybe</p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
            <p className="text-2xl font-bold text-zinc-400">{pendingCount}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Pending</p>
          </div>
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
            <p className="text-2xl font-bold text-red-400">{declinedCount}</p>
            <p className="text-xs text-zinc-500 mt-0.5">Declined</p>
          </div>
        </div>

        {/* ── Invite Link ──────────────────────────────────────── */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Invite Link
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300 font-mono truncate">
              {inviteLink}
            </div>
            <button
              onClick={handleCopyLink}
              className={clsx(
                "shrink-0 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors",
                copied
                  ? "bg-green-400 text-zinc-900"
                  : "bg-amber-400 hover:bg-amber-300 text-zinc-900"
              )}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* ── Add Attendee Form ────────────────────────────────── */}
        {showAddForm && (
          <form
            onSubmit={handleAddAttendee}
            className="bg-zinc-900 rounded-2xl border border-amber-400/30 p-6"
          >
            <h2 className="text-lg font-bold mb-4">Add Attendee</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee((p) => ({ ...p, name: e.target.value }))}
                  placeholder="John Smith"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee((p) => ({ ...p, email: e.target.value }))}
                  placeholder="john@email.com"
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wide block mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newAttendee.phone}
                  onChange={(e) => setNewAttendee((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555-555-5555"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-900 font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                Add to Crew
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm px-4 py-2.5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Attendee List ────────────────────────────────────── */}
        <section className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Attendees ({attendees.length})
            </h2>
          </div>
          <ul className="divide-y divide-zinc-800">
            {attendees.map((attendee) => {
              const rsvp = RSVP_STYLES[attendee.rsvpStatus];
              const roleBadge = ROLE_STYLES[attendee.role];
              const canRemind =
                attendee.rsvpStatus === "pending" || attendee.rsvpStatus === "maybe";
              const wasReminded = reminderSent[attendee.id];

              return (
                <li
                  key={attendee.id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-800/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 shrink-0">
                    {attendee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm truncate">
                        {attendee.name}
                      </p>
                      {roleBadge && (
                        <span
                          className={clsx(
                            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            roleBadge.bg,
                            roleBadge.text
                          )}
                        >
                          {roleBadge.label}
                        </span>
                      )}
                      <span
                        className={clsx(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                          rsvp.bg,
                          rsvp.text
                        )}
                      >
                        {rsvp.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {attendee.email}
                      {attendee.phone && ` · ${attendee.phone}`}
                    </p>
                  </div>

                  {/* Vote indicator */}
                  <div className="shrink-0 text-center">
                    <div
                      className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        attendee.hasVoted
                          ? "bg-green-500/20 text-green-400"
                          : "bg-zinc-800 text-zinc-600"
                      )}
                      title={attendee.hasVoted ? "Has voted" : "Has not voted"}
                    >
                      {attendee.hasVoted ? "V" : "-"}
                    </div>
                    <p className="text-[9px] text-zinc-600 mt-0.5">Vote</p>
                  </div>

                  {/* Remind Button */}
                  <div className="shrink-0">
                    {canRemind && (
                      <button
                        onClick={() => handleSendReminder(attendee.id)}
                        disabled={wasReminded}
                        className={clsx(
                          "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                          wasReminded
                            ? "bg-zinc-800 text-zinc-500 cursor-default"
                            : "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20"
                        )}
                      >
                        {wasReminded ? "Sent" : "Nudge"}
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
