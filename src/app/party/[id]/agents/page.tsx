"use client";

import { useState } from "react";
import { mockDestination } from "@/data/mock";
import clsx from "clsx";
import type { AgentTaskType, AgentStatus } from "@/models/types";

interface MockWorkflow {
  id: string;
  type: AgentTaskType;
  status: AgentStatus;
  title: string;
  description: string;
  steps: { name: string; status: AgentStatus }[];
  result?: Record<string, unknown>;
}

const taskTypeLabels: Record<AgentTaskType, { label: string; icon: string }> = {
  research_destinations: { label: "Research Destinations", icon: "🔍" },
  find_accommodations: { label: "Find Accommodations", icon: "🏨" },
  book_transport: { label: "Book Transport", icon: "🚢" },
  plan_activities: { label: "Plan Activities", icon: "🏄" },
  compare_prices: { label: "Compare Prices", icon: "💰" },
  send_reminders: { label: "Send Reminders", icon: "📲" },
  collect_payments: { label: "Collect Payments", icon: "💳" },
  generate_itinerary: { label: "Generate Itinerary", icon: "📋" },
  coordinate_logistics: { label: "Coordinate Logistics", icon: "🗺️" },
  find_partner_deals: { label: "Find Partner Deals", icon: "🏷️" },
};

const statusColors: Record<AgentStatus, string> = {
  queued: "bg-gray-500/20 text-gray-400",
  running: "bg-blue-500/20 text-blue-400",
  waiting_input: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  failed: "bg-red-500/20 text-red-400",
};

const mockWorkflows: MockWorkflow[] = [
  {
    id: "wf_1",
    type: "research_destinations",
    status: "completed",
    title: "Destination Research",
    description: "Researched top 5 adventure destinations near Orange County for 12 guys, $400-500 budget.",
    steps: [
      { name: "Gathering requirements", status: "completed" },
      { name: "Researching destinations", status: "completed" },
      { name: "Comparing costs", status: "completed" },
      { name: "Generating report", status: "completed" },
    ],
    result: {
      destinations: [
        { name: "Catalina Island — Two Harbors", score: 95, cost: "$420/person" },
        { name: "Big Bear Lake", score: 82, cost: "$380/person" },
        { name: "Joshua Tree", score: 78, cost: "$350/person" },
        { name: "Mammoth Mountain", score: 75, cost: "$520/person" },
        { name: "San Diego Gaslamp", score: 70, cost: "$600/person" },
      ],
    },
  },
  {
    id: "wf_2",
    type: "book_transport",
    status: "completed",
    title: "Transport Comparison",
    description: "Compared ferry routes to Catalina Island Two Harbors.",
    steps: [
      { name: "Finding routes", status: "completed" },
      { name: "Comparing schedules", status: "completed" },
      { name: "Checking group rates", status: "completed" },
      { name: "Generating comparison", status: "completed" },
    ],
    result: {
      options: [
        {
          route: "San Pedro → Two Harbors (Direct)",
          provider: "Catalina Express",
          time: "90 min",
          cost: "$85 RT",
          recommended: true,
        },
        {
          route: "Newport Beach → Avalon → Shuttle",
          provider: "Catalina Flyer + Shuttle",
          time: "2.5 hrs",
          cost: "$89 RT",
          recommended: false,
        },
      ],
    },
  },
  {
    id: "wf_3",
    type: "plan_activities",
    status: "running",
    title: "Activity Curation",
    description: "Finding the best activities for Catalina Island...",
    steps: [
      { name: "Researching activities", status: "completed" },
      { name: "Checking availability", status: "running" },
      { name: "Finding group deals", status: "queued" },
      { name: "Building recommendations", status: "queued" },
    ],
  },
  {
    id: "wf_4",
    type: "find_partner_deals",
    status: "queued",
    title: "Partner Deals Search",
    description: "Finding exclusive deals for bachelor party groups on Catalina Island.",
    steps: [
      { name: "Searching local businesses", status: "queued" },
      { name: "Negotiating group rates", status: "queued" },
      { name: "Verifying deals", status: "queued" },
    ],
  },
];

function AgentResults({ workflow }: { workflow: MockWorkflow }) {
  if (workflow.type === "research_destinations" && workflow.result?.destinations) {
    const destinations = workflow.result.destinations as Array<{
      name: string;
      score: number;
      cost: string;
    }>;
    return (
      <div className="space-y-2">
        <h4 className="text-white text-sm font-medium">Top Destinations</h4>
        {destinations.map((dest, i) => (
          <div
            key={i}
            className={clsx(
              "flex items-center justify-between p-3 rounded-xl",
              i === 0 ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  i === 0 ? "bg-amber-500 text-black" : "bg-white/10 text-gray-400"
                )}
              >
                {i + 1}
              </span>
              <span className="text-white text-sm">{dest.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{dest.cost}</span>
              <span className="text-emerald-400 text-sm font-medium">{dest.score}%</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (workflow.type === "book_transport" && workflow.result?.options) {
    const options = workflow.result.options as Array<{
      route: string;
      provider: string;
      time: string;
      cost: string;
      recommended: boolean;
    }>;
    return (
      <div className="space-y-2">
        <h4 className="text-white text-sm font-medium">Transport Options</h4>
        {options.map((opt, i) => (
          <div
            key={i}
            className={clsx(
              "flex items-center justify-between p-3 rounded-xl",
              opt.recommended ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/5"
            )}
          >
            <div>
              <div className="text-white text-sm font-medium">
                {opt.route}
                {opt.recommended && (
                  <span className="ml-2 text-emerald-400 text-xs">✓ Recommended</span>
                )}
              </div>
              <div className="text-gray-400 text-xs">
                {opt.provider} · {opt.time}
              </div>
            </div>
            <span className="text-white font-medium text-sm">{opt.cost}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function AgentsPage() {
  const [workflows] = useState(mockWorkflows);
  const [showNewAgent, setShowNewAgent] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Agents</h1>
          <p className="text-gray-400 mt-1">
            Your AI-powered planning crew
          </p>
        </div>
        <button
          onClick={() => setShowNewAgent(!showNewAgent)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
        >
          🤖 Run New Agent
        </button>
      </div>

      {/* New Agent Selector */}
      {showNewAgent && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h3 className="text-white font-semibold mb-4">
            Choose an Agent Task
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(taskTypeLabels).map(([type, { label, icon }]) => (
              <button
                key={type}
                onClick={() => setShowNewAgent(false)}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-left"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white text-sm font-medium">{label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Workflow Cards */}
      <div className="space-y-4">
        {workflows.map((wf) => {
          const typeInfo = taskTypeLabels[wf.type];
          const completedSteps = wf.steps.filter(
            (s) => s.status === "completed"
          ).length;

          return (
            <div
              key={wf.id}
              className={clsx(
                "rounded-2xl border p-6",
                wf.status === "running"
                  ? "border-blue-500/30 bg-blue-500/5"
                  : wf.status === "completed"
                  ? "border-emerald-500/20 bg-white/5"
                  : "border-white/10 bg-white/5"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{typeInfo.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{wf.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {wf.description}
                    </p>
                  </div>
                </div>
                <span
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusColors[wf.status]
                  )}
                >
                  {wf.status === "running" && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-1.5" />
                  )}
                  {wf.status}
                </span>
              </div>

              {/* Step Progress */}
              <div className="mt-4 flex items-center gap-2">
                {wf.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div
                      className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        step.status === "completed"
                          ? "bg-emerald-500 text-white"
                          : step.status === "running"
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-white/10 text-gray-500"
                      )}
                    >
                      {step.status === "completed" ? "✓" : i + 1}
                    </div>
                    {i < wf.steps.length - 1 && (
                      <div
                        className={clsx(
                          "flex-1 h-0.5",
                          step.status === "completed"
                            ? "bg-emerald-500"
                            : "bg-white/10"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {completedSteps}/{wf.steps.length} steps completed
              </div>

              {/* Results */}
              {wf.status === "completed" && wf.result && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <AgentResults workflow={wf} />
                  <button className="mt-3 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors">
                    Apply to Itinerary →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
