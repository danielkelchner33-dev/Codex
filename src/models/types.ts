// ============================================================
// StagParty.io — Bachelor Party Planning Platform
// Core Data Models & Types
// ============================================================

// ── Event & Party ───────────────────────────────────────────

export interface BachelorParty {
  id: string;
  name: string;                     // e.g. "Dan's Bachelor Party"
  groomName: string;
  bestManName: string;
  createdAt: string;
  status: PartyStatus;
  inviteCode: string;               // shareable link code
  destination: Destination | null;
  dates: DateRange | null;
  budget: BudgetConfig | null;
  itinerary: Itinerary | null;
  attendees: Attendee[];
  votes: VoteSession[];
  agentWorkflows: AgentWorkflow[];
  partnerDeals: PartnerDeal[];
}

export type PartyStatus =
  | "draft"
  | "voting"
  | "planning"
  | "booked"
  | "in_progress"
  | "completed";

// ── Dates ───────────────────────────────────────────────────

export interface DateRange {
  start: string;   // ISO date
  end: string;
  flexibleDays: number;
}

export interface DateVote {
  attendeeId: string;
  availableDates: string[];   // ISO dates they can attend
  preference: "preferred" | "available" | "last_resort";
}

// ── Destination ─────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  description: string;
  type: DestinationType;
  location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  estimatedCostPerPerson: number;
  highlights: string[];
  imageUrl?: string;
}

export type DestinationType =
  | "beach"
  | "mountain"
  | "city"
  | "island"
  | "camping"
  | "adventure"
  | "international";

// ── Attendees ───────────────────────────────────────────────

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AttendeeRole;
  rsvpStatus: RSVPStatus;
  budgetPreference?: BudgetTier;
  dietaryRestrictions?: string[];
  travelFrom?: string;            // where they're coming from
  joinedAt?: string;
  hasVoted: boolean;
}

export type AttendeeRole = "groom" | "best_man" | "groomsman" | "guest";
export type RSVPStatus = "pending" | "confirmed" | "declined" | "maybe";
export type BudgetTier = "budget" | "moderate" | "premium" | "baller";

// ── Budget ──────────────────────────────────────────────────

export interface BudgetConfig {
  totalPerPerson: number;
  breakdown: BudgetBreakdown;
  groomPaysNothing: boolean;       // classic move — boys cover the groom
  paymentDeadline: string;
  venmoHandle?: string;
  splitMethod: "equal" | "custom";
}

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  activities: number;
  food: number;
  drinks: number;
  misc: number;
}

// ── Voting System ───────────────────────────────────────────

export interface VoteSession {
  id: string;
  partyId: string;
  type: VoteType;
  title: string;
  description: string;
  options: VoteOption[];
  status: "open" | "closed";
  createdAt: string;
  closesAt: string;
  results?: VoteResults;
}

export type VoteType =
  | "destination"
  | "dates"
  | "budget"
  | "activity"
  | "accommodation"
  | "transport"
  | "custom";

export interface VoteOption {
  id: string;
  label: string;
  description: string;
  metadata?: Record<string, unknown>;
  imageUrl?: string;
}

export interface VoteCast {
  attendeeId: string;
  optionId: string;
  rank?: number;           // for ranked-choice voting
  timestamp: string;
}

export interface VoteResults {
  winner: VoteOption;
  tallies: { optionId: string; count: number; percentage: number }[];
  totalVotes: number;
}

// ── Itinerary ───────────────────────────────────────────────

export interface Itinerary {
  id: string;
  partyId: string;
  days: ItineraryDay[];
  notes: string;
  lastUpdated: string;
}

export interface ItineraryDay {
  date: string;
  title: string;       // e.g. "Day 1 — Arrival & Setup"
  events: ItineraryEvent[];
}

export interface ItineraryEvent {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description: string;
  type: EventType;
  location?: string;
  cost?: number;
  bookingUrl?: string;
  bookingStatus: BookingStatus;
  partnerDealId?: string;
  notes?: string;
}

export type EventType =
  | "transport"
  | "accommodation"
  | "activity"
  | "meal"
  | "drinks"
  | "free_time"
  | "ceremony"
  | "custom";

export type BookingStatus = "not_booked" | "pending" | "confirmed" | "cancelled";

// ── Agent Workflows ─────────────────────────────────────────

export interface AgentWorkflow {
  id: string;
  partyId: string;
  type: AgentTaskType;
  status: AgentStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  steps: AgentStep[];
  createdAt: string;
  completedAt?: string;
}

export type AgentTaskType =
  | "research_destinations"
  | "find_accommodations"
  | "book_transport"
  | "plan_activities"
  | "compare_prices"
  | "send_reminders"
  | "collect_payments"
  | "generate_itinerary"
  | "coordinate_logistics"
  | "find_partner_deals";

export type AgentStatus =
  | "queued"
  | "running"
  | "waiting_input"
  | "completed"
  | "failed";

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  result?: unknown;
  timestamp: string;
}

// ── Monetization & Partners ─────────────────────────────────

export interface PartnerDeal {
  id: string;
  partnerName: string;
  partnerType: PartnerType;
  dealTitle: string;
  description: string;
  discountPercent?: number;
  discountFlat?: number;
  promoCode?: string;
  affiliateUrl: string;
  commission: number;          // our cut percentage
  validUntil: string;
  destination?: string;        // location-specific deal
  category: EventType;
}

export type PartnerType =
  | "hotel"
  | "restaurant"
  | "bar"
  | "activity_provider"
  | "transport"
  | "equipment_rental"
  | "photographer"
  | "custom";

export interface MonetizationConfig {
  freeTier: TierConfig;
  proTier: TierConfig;
  premiumTier: TierConfig;
}

export interface TierConfig {
  name: string;
  price: number;               // monthly or per-event
  features: string[];
  maxAttendees: number;
  maxVotes: number;
  agentWorkflowsIncluded: number;
  partnerDealsAccess: boolean;
  whiteLabel: boolean;
}
