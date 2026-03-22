"use client";

// ============================================================
// StagParty.io — Partner Deals Marketplace
// Browse, filter, and book exclusive partner deals
// ============================================================

import React, { useState } from "react";
import type { PartnerDeal, EventType, PartnerType } from "@/models/types";
import { formatCurrency } from "@/utils/helpers";

// ── Theme ───────────────────────────────────────────────────

const c = {
  bg: "#0F0F0F",
  surface: "#1A1A1A",
  card: "#1E1E1E",
  border: "#2A2A2A",
  gold: "#D4A843",
  goldMuted: "#B8943E",
  goldLight: "rgba(212, 168, 67, 0.12)",
  text: "#F5F5F5",
  textMuted: "#999999",
  textDim: "#666666",
  success: "#4ADE80",
  error: "#F87171",
};

// ── Category Filters ────────────────────────────────────────

type FilterCategory = EventType | "all";

const CATEGORY_FILTERS: { label: string; value: FilterCategory }[] = [
  { label: "All Deals", value: "all" },
  { label: "Transport", value: "transport" },
  { label: "Accommodation", value: "accommodation" },
  { label: "Activities", value: "activity" },
  { label: "Food & Drink", value: "meal" },
  { label: "Gear", value: "custom" },
];

// ── Partner Type Icons ──────────────────────────────────────

const PARTNER_ICONS: Record<PartnerType, string> = {
  hotel: "\u{1F3E8}",
  restaurant: "\u{1F37D}",
  bar: "\u{1F37B}",
  activity_provider: "\u{1F3C4}",
  transport: "\u{1F6A2}",
  equipment_rental: "\u{1F3BF}",
  photographer: "\u{1F4F8}",
  custom: "\u{1F4E6}",
};

// ── Catalina-Specific Example Deals ─────────────────────────

const DEALS: PartnerDeal[] = [
  {
    id: "deal_1",
    partnerName: "Catalina Express",
    partnerType: "transport",
    dealTitle: "Group Rate — 10+ Passengers Save 15%",
    description:
      "Book 10 or more round-trip tickets on Catalina Express and save 15% on the group fare. Valid for Newport Beach, San Pedro, and Long Beach routes to Avalon or Two Harbors.",
    discountPercent: 15,
    promoCode: "STAGPARTY15",
    affiliateUrl: "https://www.catalinaexpress.com/group-sales",
    commission: 8,
    validUntil: "2026-12-31",
    destination: "Catalina Island",
    category: "transport",
  },
  {
    id: "deal_2",
    partnerName: "Two Harbors Campground",
    partnerType: "hotel",
    dealTitle: "Bachelor Party Campsite Package",
    description:
      "Reserve 3+ adjacent campsites at Two Harbors and get the 4th site free. Includes group fire ring and picnic area. Perfect for groups of 8-16.",
    discountPercent: 25,
    promoCode: "STAGCAMP25",
    affiliateUrl: "https://www.visitcatalinaisland.com/camping",
    commission: 10,
    validUntil: "2026-10-31",
    destination: "Catalina Island",
    category: "accommodation",
  },
  {
    id: "deal_3",
    partnerName: "Descanso Beach Ocean Sports",
    partnerType: "equipment_rental",
    dealTitle: "Kayak & Snorkel Combo — Group Rate",
    description:
      "2-hour kayak rental + snorkel gear for your whole crew at a flat group rate. Includes basic instruction and waterproof phone pouches. Available daily 9 AM - 3 PM.",
    discountFlat: 10,
    promoCode: "STAGPADDLE",
    affiliateUrl: "https://www.kayakcatalinaisland.com",
    commission: 12,
    validUntil: "2026-09-30",
    destination: "Catalina Island",
    category: "activity",
  },
  {
    id: "deal_4",
    partnerName: "Harbor Reef Restaurant",
    partnerType: "restaurant",
    dealTitle: "Group Dinner — Free Appetizer Platter",
    description:
      "Book a group dinner for 8+ at Harbor Reef Restaurant in Avalon and get a complimentary appetizer platter. Oceanfront seating available. Reservation required 48 hours in advance.",
    discountFlat: 45,
    promoCode: "STAGREEF",
    affiliateUrl: "https://www.harborreefcatalina.com",
    commission: 7,
    validUntil: "2026-11-30",
    destination: "Catalina Island",
    category: "meal",
  },
  {
    id: "deal_5",
    partnerName: "Catalina Zip Line Eco Tour",
    partnerType: "activity_provider",
    dealTitle: "Bachelor Party Zip Line — Book 8, Get 2 Free",
    description:
      "Book 8 zip line tour tickets and get 2 additional spots free. 5 zip lines across Descanso Canyon with ocean views. Includes photos and GoPro rental.",
    discountPercent: 20,
    promoCode: "STAGZIP20",
    affiliateUrl: "https://www.catalinaislandzip.com",
    commission: 10,
    validUntil: "2026-09-30",
    destination: "Catalina Island",
    category: "activity",
  },
  {
    id: "deal_6",
    partnerName: "Luau Larry's",
    partnerType: "bar",
    dealTitle: "Bachelor Party Bucket Special",
    description:
      "Mention StagParty for a free souvenir bucket when your group orders 10+ drinks. The groom drinks free (first 3 cocktails). Catalina's most famous tiki bar.",
    discountFlat: 30,
    affiliateUrl: "https://www.luaularrys.com",
    commission: 5,
    validUntil: "2026-12-31",
    destination: "Catalina Island",
    category: "drinks" as EventType,
  },
  {
    id: "deal_7",
    partnerName: "Afishinados Charters",
    partnerType: "activity_provider",
    dealTitle: "Half-Day Fishing Charter — Group Discount",
    description:
      "Private half-day deep sea fishing charter out of Avalon Harbor. Up to 6 anglers per boat. All gear, bait, and fish cleaning included. 10% off for StagParty groups.",
    discountPercent: 10,
    promoCode: "STAGFISH10",
    affiliateUrl: "https://www.afishinados.com",
    commission: 8,
    validUntil: "2026-10-31",
    destination: "Catalina Island",
    category: "activity",
  },
  {
    id: "deal_8",
    partnerName: "Island Rentals",
    partnerType: "equipment_rental",
    dealTitle: "Golf Cart Fleet — 4+ Cart Group Rate",
    description:
      "Rent 4 or more golf carts for the day and save $15 per cart. Explore Avalon and the surrounding hills at your own pace. Free map and route guide included.",
    discountFlat: 15,
    promoCode: "STAGCARTS",
    affiliateUrl: "https://www.islandrentals.com",
    commission: 9,
    validUntil: "2026-12-31",
    destination: "Catalina Island",
    category: "activity",
  },
];

// ── Component ───────────────────────────────────────────────

export default function MarketplacePage() {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [showSuggest, setShowSuggest] = useState(false);
  const [isBestMan] = useState(true); // would come from auth in production

  const filteredDeals =
    filter === "all" ? DEALS : DEALS.filter((d) => d.category === filter);

  const featuredDeals = DEALS.filter((d) => d.destination === "Catalina Island").slice(0, 3);

  return (
    <div style={{ background: c.bg, minHeight: "100vh", color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <header
        style={{
          padding: "2rem 2rem 1.5rem",
          borderBottom: `1px solid ${c.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: c.gold }}>
            Partner Deals
          </h1>
          <p style={{ color: c.textMuted, margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
            Exclusive discounts for your bachelor party
          </p>
        </div>
        <button
          onClick={() => setShowSuggest(!showSuggest)}
          style={{
            background: c.surface,
            color: c.text,
            border: `1px solid ${c.border}`,
            padding: "0.7rem 1.25rem",
            borderRadius: "0.5rem",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          Suggest a Deal
        </button>
      </header>

      <main style={{ padding: "1.5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* Featured for Your Destination */}
        <div
          style={{
            background: `linear-gradient(135deg, ${c.goldLight}, rgba(212, 168, 67, 0.04))`,
            border: `1px solid rgba(212, 168, 67, 0.25)`,
            borderRadius: "0.75rem",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: c.gold, margin: "0 0 0.2rem" }}>
            Featured for Catalina Island
          </h2>
          <p style={{ fontSize: "0.8rem", color: c.textMuted, margin: "0 0 1rem" }}>
            Curated deals for your destination. Book through StagParty for automatic discounts.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto" }}>
            {featuredDeals.map((deal) => (
              <div
                key={deal.id}
                style={{
                  background: c.card,
                  border: `1px solid ${c.gold}`,
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  minWidth: 220,
                  flex: "0 0 auto",
                }}
              >
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: c.gold, marginBottom: "0.2rem" }}>
                  {deal.partnerName}
                </div>
                <div style={{ fontSize: "0.75rem", color: c.textMuted, marginBottom: "0.3rem" }}>
                  {deal.dealTitle}
                </div>
                {deal.discountPercent && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: c.success }}>
                    {deal.discountPercent}% OFF
                  </span>
                )}
                {deal.discountFlat && !deal.discountPercent && (
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: c.success }}>
                    {formatCurrency(deal.discountFlat)} OFF
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              style={{
                background: filter === cat.value ? c.gold : c.surface,
                color: filter === cat.value ? c.bg : c.textMuted,
                border: `1px solid ${filter === cat.value ? c.gold : c.border}`,
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Deal Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              style={{
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "0.75rem",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Deal Content */}
              <div style={{ padding: "1.25rem", flex: 1 }}>
                {/* Partner header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {/* Logo placeholder */}
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "0.5rem",
                        background: c.goldLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        flexShrink: 0,
                      }}
                    >
                      {PARTNER_ICONS[deal.partnerType] || "\u{1F4E6}"}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: c.text }}>
                        {deal.partnerName}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: c.textDim }}>
                        {deal.destination || "All Destinations"}
                      </div>
                    </div>
                  </div>

                  {/* Discount badge */}
                  {deal.discountPercent ? (
                    <span
                      style={{
                        background: "rgba(74, 222, 128, 0.12)",
                        color: c.success,
                        border: `1px solid rgba(74, 222, 128, 0.3)`,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "2rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {deal.discountPercent}% OFF
                    </span>
                  ) : deal.discountFlat ? (
                    <span
                      style={{
                        background: "rgba(74, 222, 128, 0.12)",
                        color: c.success,
                        border: `1px solid rgba(74, 222, 128, 0.3)`,
                        padding: "0.25rem 0.6rem",
                        borderRadius: "2rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatCurrency(deal.discountFlat)} OFF
                    </span>
                  ) : null}
                </div>

                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: c.text, margin: "0 0 0.4rem" }}>
                  {deal.dealTitle}
                </h3>
                <p style={{ fontSize: "0.8rem", color: c.textMuted, lineHeight: 1.5, margin: "0 0 0.75rem" }}>
                  {deal.description}
                </p>

                {/* Promo Code */}
                {deal.promoCode && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.72rem", color: c.textDim }}>Promo code:</span>
                    <code
                      style={{
                        background: c.goldLight,
                        color: c.gold,
                        padding: "0.2rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {deal.promoCode}
                    </code>
                  </div>
                )}

                <div style={{ fontSize: "0.7rem", color: c.textDim }}>
                  Valid until{" "}
                  {new Date(deal.validUntil).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Deal Footer */}
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  borderTop: `1px solid ${c.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span style={{ fontSize: "0.7rem", color: c.textDim }}>StagParty Partner</span>
                <a
                  href={deal.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: `linear-gradient(135deg, ${c.gold}, ${c.goldMuted})`,
                    color: c.bg,
                    padding: "0.45rem 1rem",
                    borderRadius: "0.4rem",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Book Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: c.textMuted }}>
            <p style={{ fontSize: "1rem" }}>No deals in this category yet</p>
            <p style={{ fontSize: "0.8rem" }}>Check back soon or suggest a partner below</p>
          </div>
        )}

        {/* Suggest a Deal Form */}
        {showSuggest && (
          <div
            style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: c.gold, margin: "0 0 0.3rem" }}>
              Suggest a Local Deal
            </h3>
            <p style={{ fontSize: "0.8rem", color: c.textMuted, margin: "0 0 1.25rem" }}>
              Know a business that should offer deals to bachelor party groups? Tell us
              and we&apos;ll reach out to set up a partnership.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: c.textMuted, marginBottom: "0.4rem" }}>
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Harbor Reef Restaurant"
                  style={{
                    width: "100%",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.4rem",
                    padding: "0.65rem 0.75rem",
                    color: c.text,
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: c.textMuted, marginBottom: "0.4rem" }}>
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Catalina Island, CA"
                  style={{
                    width: "100%",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.4rem",
                    padding: "0.65rem 0.75rem",
                    color: c.text,
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: c.textMuted, marginBottom: "0.4rem" }}>
                  Category
                </label>
                <select
                  style={{
                    width: "100%",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.4rem",
                    padding: "0.65rem 0.75rem",
                    color: c.text,
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="activity">Activities</option>
                  <option value="meal">Food & Drink</option>
                  <option value="custom">Gear / Other</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: c.textMuted, marginBottom: "0.4rem" }}>
                  What makes this great for bachelor parties?
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us why this spot is perfect for the boys..."
                  style={{
                    width: "100%",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.4rem",
                    padding: "0.65rem 0.75rem",
                    color: c.text,
                    fontSize: "0.85rem",
                    outline: "none",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: c.textMuted, marginBottom: "0.4rem" }}>
                  Contact Email or Website
                </label>
                <input
                  type="text"
                  placeholder="e.g., info@business.com or https://..."
                  style={{
                    width: "100%",
                    background: c.card,
                    border: `1px solid ${c.border}`,
                    borderRadius: "0.4rem",
                    padding: "0.65rem 0.75rem",
                    color: c.text,
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <button
              style={{
                marginTop: "1rem",
                background: `linear-gradient(135deg, ${c.gold}, ${c.goldMuted})`,
                color: c.bg,
                border: "none",
                padding: "0.6rem 1.5rem",
                borderRadius: "0.4rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Submit Suggestion
            </button>
          </div>
        )}

        {/* Commission Tracking — Best Man Only */}
        {isBestMan && (
          <div
            style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "0.75rem",
              padding: "1.25rem 1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.7rem", color: c.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Best Man View — Commission Tracking
              </span>
            </div>
            <p style={{ fontSize: "0.78rem", color: c.textMuted, margin: "0 0 1rem", lineHeight: 1.5 }}>
              Partner deals earn StagParty a commission on each booking. This keeps the platform free
              for basic planning. Your crew gets the discounts, we get a small referral fee from the businesses.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr>
                  {["Partner", "Category", "Commission %", "Status"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.5rem 0.75rem",
                        textAlign: "left",
                        color: c.gold,
                        borderBottom: `1px solid ${c.border}`,
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEALS.slice(0, 5).map((deal) => (
                  <tr key={deal.id} style={{ borderBottom: `1px solid ${c.border}` }}>
                    <td style={{ padding: "0.5rem 0.75rem", color: c.text }}>{deal.partnerName}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: c.textMuted }}>{deal.category}</td>
                    <td style={{ padding: "0.5rem 0.75rem", color: c.gold, fontWeight: 600 }}>{deal.commission}%</td>
                    <td style={{ padding: "0.5rem 0.75rem" }}>
                      <span
                        style={{
                          background: "rgba(74, 222, 128, 0.12)",
                          color: c.success,
                          padding: "0.15rem 0.5rem",
                          borderRadius: "2rem",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
