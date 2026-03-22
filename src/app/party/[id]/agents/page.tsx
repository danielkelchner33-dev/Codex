"use client";

// ============================================================
// StagParty.io — AI Agent Dashboard
// View, run, and manage AI agent workflows
// ============================================================

import React, { useState, useCallback } from "react";
import type {
  AgentWorkflow,
  AgentTaskType,
  AgentStatus,
} from "@/models/types";
import { generateId, formatCurrency } from "@/utils/helpers";

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
  running: "#60A5FA",
  queued: "#A78BFA",
};

// ── Agent Task Metadata ─────────────────────────────────────

const TASK_META: Record<
  AgentTaskType,
  { label: string; icon: string; description: string }
> = {
  research_destinations: {
    label: "Research Destinations",
    icon: "\u{1F9ED}",
    description: "Find the best destinations for your group",
  },
  find_accommodations: {
    label: "Find Accommodations",
    icon: "\u{1F6CF}",
    description: "Search for group-friendly places to stay",
  },
  book_transport: {
    label: "Plan Transport",
    icon: "\u{1F697}",
    description: "Compare routes, schedules, and group rates",
  },
  plan_activities: {
    label: "Curate Activities",
    icon: "\u{1F3C4}",
    description: "Find the perfect mix of activities",
  },
  compare_prices: {
    label: "Compare Prices",
    icon: "\u{1F4B0}",
    description: "Find the best deals across providers",
  },
  send_reminders: {
    label: "Send Reminders",
    icon: "\u{1F514}",
    description: "Draft and schedule group reminders",
  },
  collect_payments: {
    label: "Collect Payments",
    icon: "\u{1F4B3}",
    description: "Organize cost splitting and collection",
  },
  generate_itinerary: {
    label: "Generate Itinerary",
    icon: "\u{1F4C5}",
    description: "Auto-build an optimized day-by-day schedule",
  },
  coordinate_logistics: {
    label: "Coordinate Logistics",
    icon: "\u{1F4CB}",
    description: "Handle operational details and checklists",
  },
  find_partner_deals: {
    label: "Find Deals",
    icon: "\u{1F3F7}",
    description: "Discover exclusive partner discounts",
  },
};

// ── Status Helpers ──────────────────────────────────────────

function sColor(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    completed: c.success,
    running: c.running,
    failed: c.error,
    queued: c.queued,
    waiting_input: c.gold,
  };
  return map[status] ?? c.textMuted;
}

function sLabel(status: AgentStatus): string {
  const map: Record<AgentStatus, string> = {
    completed: "Completed",
    running: "Running",
    failed: "Failed",
    queued: "Queued",
    waiting_input: "Awaiting Input",
  };
  return map[status] ?? status;
}

// ── Mock Data ───────────────────────────────────────────────

const MOCK_WORKFLOWS: AgentWorkflow[] = [
  {
    id: "wf_demo1",
    partyId: "party_1",
    type: "research_destinations",
    status: "completed",
    input: {
      vibe: "Adventure + Beach",
      groupSize: 10,
      budget: 500,
      travelFrom: "Los Angeles",
    },
    output: {
      destinations: [
        {
          name: "Catalina Island",
          description:
            "Island paradise 22 miles off the SoCal coast with hiking, snorkeling, and bar-hopping in Avalon.",
          type: "island",
          pros: [
            "1-hour ferry from mainland",
            "Mix of adventure and chill",
            "Golf carts as transport",
          ],
          cons: ["Limited nightlife", "Ferry can sell out"],
          estimatedCostPerPerson: 350,
          travelLogistics: "Catalina Express from Newport Beach, 75 min",
          highlights: [
            "Snorkeling at Lovers Cove",
            "Trans-Catalina Trail",
            "Avalon bar crawl",
            "Zip-line Eco Tour",
          ],
        },
        {
          name: "San Diego",
          description:
            "Perfect combo of beaches, breweries, and nightlife. Easy drive from LA.",
          type: "beach",
          pros: ["Great nightlife", "Beach access", "Brewery scene"],
          cons: ["Can get pricey", "Touristy in summer"],
          estimatedCostPerPerson: 450,
          travelLogistics: "2-hour drive from LA",
          highlights: [
            "Gaslamp Quarter",
            "La Jolla coves",
            "Craft brewery tour",
          ],
        },
        {
          name: "Big Bear Lake",
          description:
            "Mountain retreat with lake activities and cabin vibes.",
          type: "mountain",
          pros: ["Affordable cabins", "Lake sports", "Quiet escape"],
          cons: ["Limited nightlife", "2.5-hour drive"],
          estimatedCostPerPerson: 300,
          travelLogistics: "2.5-hour drive from LA",
          highlights: [
            "Lake kayaking",
            "Mountain biking",
            "Cabin BBQ nights",
          ],
        },
      ],
    },
    steps: [
      {
        id: "s1",
        name: "Analyzing Input",
        description: "Parsed group preferences",
        status: "completed",
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        id: "s2",
        name: "AI Processing",
        description: "Generated destination recommendations",
        status: "completed",
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        id: "s3",
        name: "Finalizing",
        description: "Formatted results",
        status: "completed",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 300000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: "wf_demo2",
    partyId: "party_1",
    type: "plan_activities",
    status: "running",
    input: {
      destination: "Catalina Island",
      vibe: "Adventure + Beach",
      groupSize: 10,
      budget: 200,
      duration: 2,
    },
    steps: [
      {
        id: "s1",
        name: "Analyzing Input",
        description: "Parsed activity preferences",
        status: "completed",
        timestamp: new Date(Date.now() - 30000).toISOString(),
      },
      {
        id: "s2",
        name: "AI Processing",
        description: "Curating activity list",
        status: "running",
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: "wf_demo3",
    partyId: "party_1",
    type: "book_transport",
    status: "completed",
    input: {
      origin: "Newport Beach, CA",
      destination: "Catalina Island",
      groupSize: 10,
      startDate: "2026-06-12",
      endDate: "2026-06-14",
    },
    output: {
      options: [
        {
          provider: "Catalina Express",
          route: "Newport Beach to Avalon",
          schedule: "9:00 AM departure",
          pricePerPerson: 76.5,
          totalGroupPrice: 765,
          travelTime: "75 min",
          groupRate: false,
          notes: "Book early for weekends. Scenic harbor departure.",
        },
        {
          provider: "Catalina Express",
          route: "San Pedro to Avalon",
          schedule: "6:15 AM departure",
          pricePerPerson: 76.5,
          totalGroupPrice: 765,
          travelTime: "60 min",
          groupRate: false,
          notes: "Fastest crossing, most departures per day.",
        },
      ],
      recommendation:
        "San Pedro for more schedule flexibility; Newport Beach if the crew is in OC.",
      comparison:
        "Same price per person. San Pedro is 15 min faster with more daily departures.",
    },
    steps: [
      {
        id: "s1",
        name: "Analyzing Input",
        description: "Parsed transport request",
        status: "completed",
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: "s2",
        name: "AI Processing",
        description: "Compared ferry routes",
        status: "completed",
        timestamp: new Date(Date.now() - 500000).toISOString(),
      },
      {
        id: "s3",
        name: "Finalizing",
        description: "Formatted comparison table",
        status: "completed",
        timestamp: new Date(Date.now() - 480000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 700000).toISOString(),
    completedAt: new Date(Date.now() - 480000).toISOString(),
  },
];

// ── Spinner CSS ─────────────────────────────────────────────

const spinnerCSS = `
@keyframes stagSpin {
  to { transform: rotate(360deg); }
}
`;

// ── Component ───────────────────────────────────────────────

export default function AgentDashboardPage() {
  const [workflows, setWorkflows] = useState<AgentWorkflow[]>(MOCK_WORKFLOWS);
  const [showNewAgent, setShowNewAgent] = useState(false);
  const [selectedType, setSelectedType] = useState<AgentTaskType | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const handleRunAgent = useCallback(() => {
    if (!selectedType) return;

    const meta = TASK_META[selectedType];
    const newWorkflow: AgentWorkflow = {
      id: generateId("wf"),
      partyId: "party_1",
      type: selectedType,
      status: "queued",
      input: { note: `New ${meta.label} request` },
      steps: [
        {
          id: generateId("step"),
          name: "Queued",
          description: "Waiting to start",
          status: "queued",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setWorkflows((prev) => [newWorkflow, ...prev]);
    setShowNewAgent(false);
    setSelectedType(null);

    // Simulate status transition
    setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === newWorkflow.id
            ? {
                ...wf,
                status: "running" as const,
                steps: [
                  { ...wf.steps[0], status: "completed" as const },
                  {
                    id: generateId("step"),
                    name: "AI Processing",
                    description: "Working on it...",
                    status: "running" as const,
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : wf,
        ),
      );
    }, 1500);
  }, [selectedType]);

  const handleCancel = useCallback((id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, status: "failed" as const } : wf,
      ),
    );
  }, []);

  return (
    <div style={{ background: c.bg, minHeight: "100vh", color: c.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{spinnerCSS}</style>

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
            AI Agents
          </h1>
          <p style={{ color: c.textMuted, margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
            Let AI handle the research, planning, and coordination
          </p>
        </div>
        <button
          onClick={() => setShowNewAgent(true)}
          style={{
            background: `linear-gradient(135deg, ${c.gold}, ${c.goldMuted})`,
            color: c.bg,
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          + Run New Agent
        </button>
      </header>

      <main style={{ padding: "1.5rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
        {/* New Agent Selector */}
        {showNewAgent && (
          <div
            style={{
              background: c.surface,
              border: `1px solid ${c.gold}`,
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: c.gold, margin: 0 }}>
                Choose Agent Type
              </h2>
              <button
                onClick={() => { setShowNewAgent(false); setSelectedType(null); }}
                style={{ background: "none", border: "none", color: c.textMuted, cursor: "pointer", fontSize: "1.2rem" }}
              >
                x
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "0.75rem" }}>
              {(Object.keys(TASK_META) as AgentTaskType[]).map((type) => {
                const meta = TASK_META[type];
                const sel = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    style={{
                      background: sel ? c.goldLight : c.card,
                      border: `1px solid ${sel ? c.gold : c.border}`,
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{meta.icon}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: sel ? c.gold : c.text, marginBottom: "0.2rem" }}>
                      {meta.label}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: c.textMuted }}>{meta.description}</div>
                  </button>
                );
              })}
            </div>
            {selectedType && (
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  onClick={handleRunAgent}
                  style={{
                    background: `linear-gradient(135deg, ${c.gold}, ${c.goldMuted})`,
                    color: c.bg,
                    border: "none",
                    padding: "0.6rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                  }}
                >
                  Run {TASK_META[selectedType].label}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Workflow List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {workflows.map((wf) => {
            const meta = TASK_META[wf.type];
            const isOpen = expandedWorkflow === wf.id;
            const output = wf.output as Record<string, unknown> | undefined;

            return (
              <div
                key={wf.id}
                style={{
                  background: c.surface,
                  border: `1px solid ${wf.status === "running" ? c.running : c.border}`,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                }}
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedWorkflow(isOpen ? null : wf.id)}
                  style={{
                    width: "100%",
                    background: "none",
                    border: "none",
                    padding: "1.25rem 1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1rem", fontWeight: 600, color: c.text }}>{meta.label}</div>
                    <div style={{ fontSize: "0.8rem", color: c.textMuted, marginTop: "0.15rem" }}>
                      {Object.entries(wf.input).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                    </div>
                  </div>

                  {/* Status badge + animated spinner */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {wf.status === "running" && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          border: `2px solid ${c.running}`,
                          borderTopColor: "transparent",
                          animation: "stagSpin 0.8s linear infinite",
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: sColor(wf.status),
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {sLabel(wf.status)}
                    </span>
                  </div>

                  <span
                    style={{
                      color: c.textDim,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "0.75rem",
                    }}
                  >
                    &#9660;
                  </span>
                </button>

                {/* Expanded Panel */}
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${c.border}`, padding: "1.25rem 1.5rem" }}>

                    {/* Steps */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
                        Steps
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {wf.steps.map((step) => (
                          <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: sColor(step.status), flexShrink: 0 }} />
                            <span style={{ fontSize: "0.85rem", color: c.text, fontWeight: 500 }}>{step.name}</span>
                            <span style={{ fontSize: "0.75rem", color: c.textMuted }}>{step.description}</span>
                            {step.status === "running" && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  border: `2px solid ${c.running}`,
                                  borderTopColor: "transparent",
                                  animation: "stagSpin 0.8s linear infinite",
                                  marginLeft: 4,
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Output Renderers */}
                    {output && (
                      <div style={{ marginBottom: "1.25rem" }}>
                        <h4 style={{ fontSize: "0.75rem", fontWeight: 700, color: c.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                          Results
                        </h4>

                        {/* Destination Cards */}
                        {wf.type === "research_destinations" && output.destinations && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
                            {(output.destinations as Array<Record<string, unknown>>).map((dest, i) => (
                              <div
                                key={i}
                                style={{
                                  background: c.card,
                                  border: `1px solid ${i === 0 ? c.gold : c.border}`,
                                  borderRadius: "0.6rem",
                                  padding: "1rem",
                                }}
                              >
                                {i === 0 && (
                                  <div style={{ fontSize: "0.65rem", fontWeight: 700, color: c.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                                    Top Pick
                                  </div>
                                )}
                                <div style={{ fontSize: "1rem", fontWeight: 700, color: c.gold, marginBottom: "0.3rem" }}>
                                  {dest.name as string}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: c.textMuted, marginBottom: "0.5rem", lineHeight: 1.4 }}>
                                  {dest.description as string}
                                </div>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.success, marginBottom: "0.4rem" }}>
                                  {formatCurrency(dest.estimatedCostPerPerson as number)} / person
                                </div>
                                {dest.pros && (
                                  <div style={{ fontSize: "0.72rem", color: c.success, marginBottom: "0.3rem" }}>
                                    + {(dest.pros as string[]).slice(0, 2).join(" | ")}
                                  </div>
                                )}
                                {dest.cons && (
                                  <div style={{ fontSize: "0.72rem", color: c.error, marginBottom: "0.3rem" }}>
                                    - {(dest.cons as string[]).slice(0, 2).join(" | ")}
                                  </div>
                                )}
                                <div style={{ fontSize: "0.7rem", color: c.textDim, marginTop: "0.4rem" }}>
                                  {(dest.highlights as string[]).slice(0, 4).join(" | ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Transport Comparison Table */}
                        {wf.type === "book_transport" && output.options && (
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                              <thead>
                                <tr>
                                  {["Provider", "Route", "Time", "Price/Person", "Group Total", "Schedule"].map((h) => (
                                    <th
                                      key={h}
                                      style={{
                                        padding: "0.6rem 0.75rem",
                                        textAlign: "left",
                                        color: c.gold,
                                        borderBottom: `1px solid ${c.border}`,
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(output.options as Array<Record<string, unknown>>).map((opt, i) => (
                                  <tr key={i} style={{ borderBottom: `1px solid ${c.border}` }}>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.text, fontWeight: 500 }}>{opt.provider as string}</td>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.textMuted }}>{opt.route as string}</td>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.textMuted }}>{opt.travelTime as string}</td>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.success, fontWeight: 600 }}>{formatCurrency(opt.pricePerPerson as number)}</td>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.text }}>{formatCurrency(opt.totalGroupPrice as number)}</td>
                                    <td style={{ padding: "0.6rem 0.75rem", color: c.textMuted }}>{opt.schedule as string}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {output.recommendation && (
                              <p style={{ fontSize: "0.8rem", color: c.gold, marginTop: "0.75rem", fontStyle: "italic" }}>
                                Recommendation: {output.recommendation as string}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Activity List */}
                        {wf.type === "plan_activities" && output.activities && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {(output.activities as Array<Record<string, unknown>>).map((act, i) => (
                              <div
                                key={i}
                                style={{
                                  background: c.card,
                                  border: `1px solid ${c.border}`,
                                  borderRadius: "0.5rem",
                                  padding: "0.75rem 1rem",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 600, color: c.text, fontSize: "0.9rem" }}>{act.name as string}</div>
                                  <div style={{ fontSize: "0.72rem", color: c.textMuted, marginTop: "0.1rem" }}>
                                    {act.duration as string} | {act.vibeMatch as string}
                                  </div>
                                </div>
                                <div style={{ color: c.gold, fontWeight: 700, fontSize: "0.9rem" }}>
                                  {formatCurrency(act.costPerPerson as number)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Itinerary Day Cards */}
                        {wf.type === "generate_itinerary" && output.itinerary && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {((output.itinerary as Record<string, unknown>).days as Array<Record<string, unknown>>)?.map((day, i) => (
                              <div key={i} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: "0.5rem", padding: "1rem" }}>
                                <div style={{ fontWeight: 700, color: c.gold, fontSize: "0.9rem", marginBottom: "0.4rem" }}>{day.title as string}</div>
                                <div style={{ fontSize: "0.75rem", color: c.textMuted }}>{day.date as string}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Generic JSON Fallback */}
                        {!["research_destinations", "book_transport", "plan_activities", "generate_itinerary"].includes(wf.type) && (
                          <pre style={{ background: c.card, borderRadius: "0.5rem", padding: "1rem", fontSize: "0.72rem", color: c.textMuted, overflow: "auto", maxHeight: 200 }}>
                            {JSON.stringify(output, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      {(wf.status === "running" || wf.status === "queued") && (
                        <button
                          onClick={() => handleCancel(wf.id)}
                          style={{
                            background: "none",
                            border: `1px solid ${c.error}`,
                            color: c.error,
                            padding: "0.5rem 1rem",
                            borderRadius: "0.4rem",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      {wf.status === "completed" && output && (
                        <button
                          style={{
                            background: `linear-gradient(135deg, ${c.gold}, ${c.goldMuted})`,
                            color: c.bg,
                            border: "none",
                            padding: "0.5rem 1.25rem",
                            borderRadius: "0.4rem",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Apply to Itinerary
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {workflows.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: c.textMuted }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No agent workflows yet</p>
            <p style={{ fontSize: "0.85rem" }}>
              Click &quot;Run New Agent&quot; to let AI help plan your bachelor party
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
