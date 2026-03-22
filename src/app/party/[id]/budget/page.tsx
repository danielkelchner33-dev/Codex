"use client";

import { useState } from "react";
import { mockParty, mockBudget, mockAttendees } from "@/data/mock";
import { formatCurrency, splitCostPerPerson } from "@/utils/helpers";
import clsx from "clsx";

const categoryColors: Record<string, string> = {
  transportation: "#f59e0b",
  accommodation: "#10b981",
  activities: "#3b82f6",
  food: "#ef4444",
  drinks: "#8b5cf6",
  misc: "#6b7280",
};

const categoryIcons: Record<string, string> = {
  transportation: "🚢",
  accommodation: "⛺",
  activities: "🏄",
  food: "🍖",
  drinks: "🍻",
  misc: "📦",
};

function DonutChart({ breakdown }: { breakdown: import("@/models/types").BudgetBreakdown }) {
  const total = Object.values(breakdown).reduce((s, v) => s + v, 0);
  let cumulativePercent = 0;

  const segments = Object.entries(breakdown).map(([key, value]) => {
    const percent = (value / total) * 100;
    const offset = cumulativePercent;
    cumulativePercent += percent;
    return { key, percent, offset, color: categoryColors[key] || "#6b7280" };
  });

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {segments.map((seg) => (
          <circle
            key={seg.key}
            cx="18"
            cy="18"
            r="15.915"
            fill="transparent"
            stroke={seg.color}
            strokeWidth="3"
            strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
            strokeDashoffset={`${-seg.offset}`}
            className="transition-all duration-500"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">
          {formatCurrency(total)}
        </span>
        <span className="text-xs text-gray-400">per person</span>
      </div>
    </div>
  );
}

export default function BudgetPage() {
  const [groomPaysNothing, setGroomPaysNothing] = useState(
    mockBudget.groomPaysNothing
  );
  const party = mockParty;
  const budget = mockBudget;
  const confirmedAttendees = mockAttendees.filter(
    (a) => a.rsvpStatus === "confirmed"
  );
  const perPerson = splitCostPerPerson(
    budget.totalPerPerson * confirmedAttendees.length,
    mockAttendees,
    groomPaysNothing
  );

  // Mock payment statuses
  const [payments, setPayments] = useState<Record<string, boolean>>({
    att_2: true, // Mike (best man) paid
    att_3: true, // Jake paid
    att_4: false,
    att_5: true,
    att_6: false,
    att_7: false,
    att_9: true,
    att_10: false,
  });

  const paidCount = Object.values(payments).filter(Boolean).length;
  const totalCollected = paidCount * perPerson;
  const totalNeeded =
    Object.keys(payments).length * perPerson;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Budget Tracker</h1>
        <p className="text-gray-400 mt-1">
          {party.destination?.name} — {confirmedAttendees.length} confirmed
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-gray-400 text-sm mb-1">Per Person</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(perPerson)}
          </div>
          {groomPaysNothing && (
            <div className="text-amber-400 text-xs mt-1">
              Groom&apos;s share split among crew
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-gray-400 text-sm mb-1">Total Budget</div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(budget.totalPerPerson * confirmedAttendees.length)}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {confirmedAttendees.length} people
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-gray-400 text-sm mb-1">Collected</div>
          <div className="text-3xl font-bold text-emerald-400">
            {formatCurrency(totalCollected)}
          </div>
          <div className="text-gray-500 text-xs mt-1">
            {paidCount}/{Object.keys(payments).length} paid
          </div>
        </div>
      </div>

      {/* Groom Pays Nothing Toggle */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">
            👑 Groom Pays Nothing
          </h3>
          <p className="text-gray-400 text-sm">
            {party.groomName}&apos;s share gets split among the crew
          </p>
        </div>
        <button
          onClick={() => setGroomPaysNothing(!groomPaysNothing)}
          className={clsx(
            "w-14 h-7 rounded-full transition-colors relative",
            groomPaysNothing ? "bg-amber-500" : "bg-gray-700"
          )}
        >
          <div
            className={clsx(
              "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all",
              groomPaysNothing ? "left-7" : "left-0.5"
            )}
          />
        </button>
      </div>

      {/* Donut Chart + Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-semibold mb-6">Cost Breakdown</h3>
          <DonutChart breakdown={budget.breakdown} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">By Category</h3>
          <div className="space-y-3">
            {Object.entries(budget.breakdown).map(([key, value]) => {
              const percent = Math.round(
                (value / budget.totalPerPerson) * 100
              );
              return (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {categoryIcons[key] || "📦"}{" "}
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="text-white font-medium">
                      {formatCurrency(value)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor:
                          categoryColors[key] || "#6b7280",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Collection Progress Bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Collection Progress</h3>
          <span className="text-gray-400 text-sm">
            {formatCurrency(totalCollected)} / {formatCurrency(totalNeeded)}
          </span>
        </div>
        <div className="h-4 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
            style={{
              width: `${Math.round((totalCollected / totalNeeded) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Payment Status per Person */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Payment Status</h3>
          <div className="text-sm text-gray-400">
            Venmo: <span className="text-amber-400">{budget.venmoHandle}</span>
          </div>
        </div>
        <div className="space-y-3">
          {confirmedAttendees
            .filter((a) => a.role !== "groom" || !groomPaysNothing)
            .map((attendee) => {
              const paid = payments[attendee.id] || false;
              return (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        attendee.role === "best_man"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-white/10 text-gray-400"
                      )}
                    >
                      {attendee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {attendee.name}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {formatCurrency(perPerson)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {paid ? (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                        ✓ Paid
                      </span>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30">
                          Unpaid
                        </span>
                        <button
                          onClick={() =>
                            setPayments((p) => ({
                              ...p,
                              [attendee.id]: true,
                            }))
                          }
                          className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium hover:bg-amber-500/30 transition-colors"
                        >
                          Send Request
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          {groomPaysNothing && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
                  👑
                </div>
                <div>
                  <div className="text-amber-400 text-sm font-medium">
                    {party.groomName}
                  </div>
                  <div className="text-amber-400/50 text-xs">
                    The boys got him covered
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                FREE RIDE 👑
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Deadline */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">⏰ Payment Deadline</h3>
          <p className="text-gray-400 text-sm">
            {new Date(budget.paymentDeadline).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
          📲 Nudge All Unpaid
        </button>
      </div>
    </div>
  );
}
