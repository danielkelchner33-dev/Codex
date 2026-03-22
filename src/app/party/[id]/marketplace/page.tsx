"use client";

import { useState } from "react";
import { mockPartnerDeals } from "@/data/mock";
import { formatCurrency } from "@/utils/helpers";
import clsx from "clsx";
import type { EventType, PartnerType } from "@/models/types";

const categoryFilters: { label: string; value: EventType | "all" }[] = [
  { label: "All Deals", value: "all" },
  { label: "🚢 Transport", value: "transport" },
  { label: "⛺ Stay", value: "accommodation" },
  { label: "🏄 Activities", value: "activity" },
  { label: "🍖 Food", value: "meal" },
];

const partnerTypeIcons: Record<PartnerType, string> = {
  hotel: "🏨",
  restaurant: "🍽️",
  bar: "🍻",
  activity_provider: "🏄",
  transport: "🚢",
  equipment_rental: "🎿",
  photographer: "📸",
  custom: "📦",
};

export default function MarketplacePage() {
  const [filter, setFilter] = useState<EventType | "all">("all");
  const [showSuggest, setShowSuggest] = useState(false);

  const deals =
    filter === "all"
      ? mockPartnerDeals
      : mockPartnerDeals.filter((d) => d.category === filter);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Partner Deals</h1>
          <p className="text-gray-400 mt-1">
            Exclusive discounts for your bachelor party
          </p>
        </div>
        <button
          onClick={() => setShowSuggest(!showSuggest)}
          className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
        >
          💡 Suggest a Deal
        </button>
      </div>

      {/* Featured Section */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-lg">⭐</span>
          <h2 className="text-white font-semibold">
            Featured for Catalina Island
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          These deals are curated for your destination. Book through StagParty
          for automatic discounts.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categoryFilters.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              filter === cat.value
                ? "bg-amber-500 text-black"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-amber-500/30 transition-all"
          >
            {/* Deal Header */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    {partnerTypeIcons[deal.partnerType] || "📦"}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      {deal.partnerName}
                    </h3>
                    <span className="text-gray-500 text-xs">
                      {deal.destination}
                    </span>
                  </div>
                </div>
                {deal.discountPercent && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">
                    {deal.discountPercent}% OFF
                  </span>
                )}
                {deal.discountFlat && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold border border-emerald-500/30">
                    {formatCurrency(deal.discountFlat)} OFF
                  </span>
                )}
              </div>

              <h4 className="text-white font-medium mb-2">{deal.dealTitle}</h4>
              <p className="text-gray-400 text-sm">{deal.description}</p>

              {deal.promoCode && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Promo code:</span>
                  <code className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                    {deal.promoCode}
                  </code>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Valid until{" "}
                {new Date(deal.validUntil).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Deal Footer */}
            <div className="px-5 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
              <span className="text-gray-500 text-xs">
                StagParty Partner
              </span>
              <button className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors">
                Claim Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Suggest a Deal Form */}
      {showSuggest && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-white font-semibold mb-4">
            💡 Suggest a Local Deal
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Know a business that should be on here? Let us know and we&apos;ll
            reach out to set up a deal for bachelor party groups.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Business Name
              </label>
              <input
                type="text"
                placeholder="e.g., Harbor Reef Restaurant"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Catalina Island, CA"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                What makes this great for bachelor parties?
              </label>
              <textarea
                rows={3}
                placeholder="Tell us why this spot is perfect for the boys..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
              />
            </div>
          </div>
          <button className="mt-4 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors">
            Submit Suggestion
          </button>
        </div>
      )}

      {/* Commission Info (Best Man Only) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 text-xs">🔒 Best Man View</span>
        </div>
        <p className="text-gray-500 text-xs">
          Partner deals earn StagParty a commission on each booking. This helps
          keep the platform free for basic planning. You get the discounts, we
          get a small referral fee from the businesses. Win-win.
        </p>
      </div>
    </div>
  );
}
