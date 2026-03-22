"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { generateId, generateInviteCode } from "@/utils/helpers";
import type { BachelorParty, PartyStatus } from "@/models/types";

// ── Vibe options ────────────────────────────────────────────

const vibeOptions = [
  { value: "adventure", label: "Adventure", emoji: "🏔️", description: "Skydiving, rafting, off-road" },
  { value: "party", label: "Party", emoji: "🍾", description: "Clubs, bars, bottle service" },
  { value: "chill", label: "Chill", emoji: "😎", description: "Beach house, golf, good food" },
  { value: "outdoors", label: "Outdoors", emoji: "🏕️", description: "Camping, fishing, hiking" },
  { value: "mixed", label: "Mixed", emoji: "🎯", description: "A little bit of everything" },
] as const;

type Vibe = (typeof vibeOptions)[number]["value"];

// ── Form state shape ────────────────────────────────────────

interface CreateFormState {
  groomName: string;
  bestManName: string;
  bestManEmail: string;
  bestManPhone: string;
  startDate: string;
  endDate: string;
  vibe: Vibe | "";
  groupSize: string;
  destination: string;
}

const initialState: CreateFormState = {
  groomName: "",
  bestManName: "",
  bestManEmail: "",
  bestManPhone: "",
  startDate: "",
  endDate: "",
  vibe: "",
  groupSize: "",
  destination: "",
};

// ── Component ───────────────────────────────────────────────

export default function CreatePartyPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayName = form.groomName.trim() || "the Groom";

  function update<K extends keyof CreateFormState>(key: K, value: CreateFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.groomName.trim()) return setError("Groom name is required.");
    if (!form.bestManName.trim()) return setError("Best man name is required.");
    if (!form.bestManEmail.trim()) return setError("Best man email is required.");
    if (!form.vibe) return setError("Pick a vibe for the party.");

    setSubmitting(true);

    try {
      const partyId = generateId("party");
      const inviteCode = generateInviteCode();

      // Build party object (in a real app this would hit an API / server action)
      const party: BachelorParty = {
        id: partyId,
        name: `${form.groomName.trim()}'s Bachelor Party`,
        groomName: form.groomName.trim(),
        bestManName: form.bestManName.trim(),
        createdAt: new Date().toISOString(),
        status: "draft" as PartyStatus,
        inviteCode,
        destination: null,
        dates:
          form.startDate && form.endDate
            ? { start: form.startDate, end: form.endDate, flexibleDays: 2 }
            : null,
        budget: null,
        itinerary: null,
        attendees: [
          {
            id: generateId("att"),
            name: form.bestManName.trim(),
            email: form.bestManEmail.trim(),
            phone: form.bestManPhone.trim() || undefined,
            role: "best_man",
            rsvpStatus: "confirmed",
            hasVoted: false,
          },
        ],
        votes: [],
        agentWorkflows: [],
        partnerDeals: [],
      };

      // Persist to localStorage for now (replace with API call)
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("stagparty_parties") || "[]");
        stored.push(party);
        localStorage.setItem("stagparty_parties", JSON.stringify(stored));
      }

      router.push(`/party/${partyId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Nav */}
      <header className="border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="gradient-gold-text">Stag</span>Party.io
          </Link>
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Back to Home
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Plan{" "}
            <span className="gradient-gold-text">{displayName}&apos;s</span>{" "}
            Bachelor Party
          </h1>
          <p className="mt-3 text-text-secondary">
            Fill in the basics and we&apos;ll handle the rest. Takes about 60 seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          {/* ── Card: The Groom ──────────────────────────── */}
          <fieldset className="card-glass rounded-[var(--radius-card)] p-6 space-y-5">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              The Groom
            </legend>

            <InputField
              label="Groom's Name"
              placeholder="e.g. Dan"
              value={form.groomName}
              onChange={(v) => update("groomName", v)}
              required
            />
          </fieldset>

          {/* ── Card: Best Man (You) ─────────────────────── */}
          <fieldset className="card-glass rounded-[var(--radius-card)] p-6 space-y-5">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Best Man (You)
            </legend>

            <InputField
              label="Your Name"
              placeholder="e.g. Jake"
              value={form.bestManName}
              onChange={(v) => update("bestManName", v)}
              required
            />
            <InputField
              label="Email"
              type="email"
              placeholder="jake@example.com"
              value={form.bestManEmail}
              onChange={(v) => update("bestManEmail", v)}
              required
            />
            <InputField
              label="Phone (optional)"
              type="tel"
              placeholder="+1 555-123-4567"
              value={form.bestManPhone}
              onChange={(v) => update("bestManPhone", v)}
            />
          </fieldset>

          {/* ── Card: Party Details ──────────────────────── */}
          <fieldset className="card-glass rounded-[var(--radius-card)] p-6 space-y-5">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Party Details
            </legend>

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(v) => update("startDate", v)}
              />
              <InputField
                label="End Date"
                type="date"
                value={form.endDate}
                onChange={(v) => update("endDate", v)}
              />
            </div>

            {/* Vibe selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">
                Vibe <span className="text-gold-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {vibeOptions.map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => update("vibe", v.value)}
                    className={clsx(
                      "flex flex-col items-center gap-1 rounded-[var(--radius-card)] border p-4 text-center transition-all",
                      form.vibe === v.value
                        ? "border-gold-500 bg-gold-500/10 text-text-primary"
                        : "border-navy-600 bg-navy-800/40 text-text-secondary hover:border-navy-500",
                    )}
                  >
                    <span className="text-2xl">{v.emoji}</span>
                    <span className="text-sm font-semibold">{v.label}</span>
                    <span className="text-[11px] text-text-muted">{v.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Group size */}
            <InputField
              label="Estimated Group Size"
              type="number"
              placeholder="e.g. 8"
              min="2"
              max="50"
              value={form.groupSize}
              onChange={(v) => update("groupSize", v)}
            />

            {/* Destination */}
            <InputField
              label="Destination (if decided)"
              placeholder="e.g. Austin, TX — or leave blank to decide with the crew"
              value={form.destination}
              onChange={(v) => update("destination", v)}
            />
          </fieldset>

          {/* ── Error ────────────────────────────────────── */}
          {error && (
            <div className="rounded-[var(--radius-input)] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ── Submit ───────────────────────────────────── */}
          <button
            type="submit"
            disabled={submitting}
            className={clsx(
              "w-full gradient-gold glow-gold rounded-[var(--radius-button)] px-8 py-4 text-lg font-bold text-navy-950 transition-transform",
              submitting
                ? "cursor-not-allowed opacity-60"
                : "hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            {submitting ? "Creating Party..." : "Create Party & Invite the Crew"}
          </button>

          <p className="text-center text-xs text-text-muted">
            You can always edit everything later. No commitments yet.
          </p>
        </form>
      </main>
    </div>
  );
}

// ── Reusable input component ────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  max,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="ml-1 text-gold-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className={clsx(
          "focus-gold w-full rounded-[var(--radius-input)] border border-navy-600 bg-navy-800/60 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted",
          "transition-colors focus:border-gold-500/50",
        )}
      />
    </div>
  );
}
