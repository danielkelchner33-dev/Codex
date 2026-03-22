"use client";

import { useState } from "react";
import { mockItinerary, mockParty } from "@/data/mock";
import { formatCurrency } from "@/utils/helpers";
import clsx from "clsx";
import type { BookingStatus, ItineraryEvent } from "@/models/types";

type Mode = "planning" | "live";

const bookingColors: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  not_booked: "bg-white/10 text-gray-400 border-white/20",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const typeIcons: Record<string, string> = {
  transport: "🚢",
  accommodation: "⛺",
  activity: "🏄",
  meal: "🍖",
  drinks: "🍻",
  free_time: "🎯",
  ceremony: "🎉",
  custom: "📌",
};

function EventCard({
  event,
  isLive,
  isNow,
}: {
  event: ItineraryEvent;
  isLive: boolean;
  isNow: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative pl-8 pb-8 border-l-2",
        isNow ? "border-amber-500" : "border-white/10"
      )}
    >
      {/* Timeline dot */}
      <div
        className={clsx(
          "absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full border-2",
          isNow
            ? "bg-amber-500 border-amber-400 animate-pulse"
            : event.bookingStatus === "confirmed"
            ? "bg-emerald-500 border-emerald-400"
            : "bg-gray-700 border-gray-600"
        )}
      />

      <div
        className={clsx(
          "ml-4 rounded-xl border p-4",
          isNow
            ? "border-amber-500/30 bg-amber-500/10"
            : "border-white/10 bg-white/5"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{typeIcons[event.type] || "📌"}</span>
              <span className="text-sm text-gray-400">
                {event.time}
                {event.endTime && ` – ${event.endTime}`}
              </span>
              {isNow && isLive && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold animate-pulse">
                  NOW
                </span>
              )}
            </div>
            <h4 className="text-white font-semibold">{event.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{event.description}</p>

            {event.location && (
              <p className="text-gray-500 text-xs mt-2">📍 {event.location}</p>
            )}
            {event.notes && (
              <p className="text-amber-400/70 text-xs mt-1 italic">
                💡 {event.notes}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {event.cost !== undefined && event.cost > 0 && (
              <span className="text-white font-medium">
                {formatCurrency(event.cost)}
              </span>
            )}
            <span
              className={clsx(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                bookingColors[event.bookingStatus]
              )}
            >
              {event.bookingStatus.replace("_", " ")}
            </span>
            {event.partnerDealId && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Partner Deal
              </span>
            )}
          </div>
        </div>

        {isLive && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <button className="text-xs text-gray-500 hover:text-white transition-colors">
              📸 Add Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ItineraryPage() {
  const [mode, setMode] = useState<Mode>("planning");
  const itinerary = mockItinerary;
  const party = mockParty;

  return (
    <div className="space-y-8">
      {/* Header with Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Itinerary</h1>
          <p className="text-gray-400 mt-1">{party.destination?.name}</p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
          <button
            onClick={() => setMode("planning")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === "planning"
                ? "bg-amber-500 text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            📋 Planning
          </button>
          <button
            onClick={() => setMode("live")}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              mode === "live"
                ? "bg-emerald-500 text-black"
                : "text-gray-400 hover:text-white"
            )}
          >
            🔴 Live Mode
          </button>
        </div>
      </div>

      {/* Live Mode Banner */}
      {mode === "live" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-400 font-semibold">
                🔴 Live Mode Active
              </h3>
              <p className="text-emerald-400/60 text-sm">
                Real-time updates for the crew
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
                📍 Share Location
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-colors">
                ⏰ Running Late
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors">
                📢 Change of Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Itinerary Suggestion */}
      {mode === "planning" && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            🤖 Let AI Build Your Itinerary
          </h3>
          <p className="text-gray-400 mb-4">
            Based on your destination, dates, budget, and voted activities — our
            AI agent will create the perfect schedule.
          </p>
          <button className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
            Generate Itinerary
          </button>
        </div>
      )}

      {/* Day-by-Day Timeline */}
      {itinerary.days.map((day, dayIndex) => (
        <div key={day.date} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-xl font-semibold">
              {day.title}
            </div>
            <span className="text-gray-500 text-sm">
              {new Date(day.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            {mode === "planning" && (
              <button className="ml-auto text-sm text-gray-500 hover:text-amber-400 transition-colors">
                + Add Event
              </button>
            )}
          </div>

          <div className="ml-4">
            {day.events.map((event, eventIndex) => (
              <EventCard
                key={event.id}
                event={event}
                isLive={mode === "live"}
                isNow={mode === "live" && dayIndex === 0 && eventIndex === 2}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Notes */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-white font-medium mb-2">📝 Trip Notes</h3>
        <p className="text-gray-400 text-sm">{itinerary.notes}</p>
      </div>

      {/* Emergency Contacts (Live Mode) */}
      {mode === "live" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <h3 className="text-red-400 font-medium mb-3">🆘 Emergency Contacts</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-gray-400">
              <span className="text-white">Two Harbors Rangers:</span> (310) 510-4205
            </div>
            <div className="text-gray-400">
              <span className="text-white">Coast Guard:</span> (310) 521-5700
            </div>
            <div className="text-gray-400">
              <span className="text-white">Best Man (Mike):</span> (555) 987-6543
            </div>
            <div className="text-gray-400">
              <span className="text-white">Catalina Express:</span> (800) 995-4386
            </div>
          </div>
        </div>
      )}

      {/* Share / Print */}
      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
          📤 Share Itinerary
        </button>
        <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors">
          🖨️ Print View
        </button>
      </div>
    </div>
  );
}
