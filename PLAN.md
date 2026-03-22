# StagParty.io — Bachelor Party Planning Platform

## Product Vision

**One-liner:** The best man's command center for planning epic bachelor parties — powered by AI agents that handle the grunt work so the crew can focus on having fun.

**Problem:** Planning a bachelor party is chaos. One guy is texting 15 people about dates, another is googling "things to do in Catalina," everyone has different budgets, nobody knows who's actually confirmed, and the best man ends up doing 90% of the work in a group chat that moves too fast.

**Solution:** A shareable planning hub where the crew votes on everything, AI agents research and compare options, and the best man has a dashboard to track RSVPs, budget, bookings, and the full itinerary.

---

## Target User

**Primary:** Best men (25-35) planning bachelor parties for their boys
**Secondary:** Grooms who want visibility into the plan
**Tertiary:** Activity providers, venues, and destinations who want to attract bachelor party groups

---

## Core User Flow

```
Best Man creates party → Shares invite link → Crew joins & RSVPs
    → Vote on dates → Vote on destination → Set budget
    → AI Agent researches options → Build itinerary
    → Book everything → Collect payments → Send the groom off right
```

---

## Architecture

### Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes + Server Actions
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** NextAuth.js (magic link / OAuth for easy crew onboarding)
- **AI/Agents:** Claude API (Anthropic SDK) for agentic workflows
- **Payments:** Stripe (for premium tiers) + Venmo/Zelle links (for group splits)
- **Realtime:** Server-Sent Events or Pusher for live vote updates
- **Hosting:** Vercel
- **Storage:** Vercel Blob (for photos, receipts)

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── create/                   # Create new party flow
│   │   └── page.tsx
│   ├── party/[id]/               # Party dashboard
│   │   ├── page.tsx              # Overview/dashboard
│   │   ├── vote/                 # Voting hub
│   │   │   └── page.tsx
│   │   ├── itinerary/            # Itinerary builder
│   │   │   └── page.tsx
│   │   ├── budget/               # Budget tracker
│   │   │   └── page.tsx
│   │   └── crew/                 # Attendee management
│   │       └── page.tsx
│   ├── join/[code]/              # Invite link landing
│   │   └── page.tsx
│   └── api/                      # API routes
│       ├── parties/
│       ├── votes/
│       ├── agents/
│       └── webhooks/
├── components/                   # Shared UI components
│   ├── ui/                       # Base components (buttons, cards, etc.)
│   ├── party/                    # Party-specific components
│   ├── voting/                   # Voting components
│   └── itinerary/                # Itinerary components
├── agents/                       # AI Agent workflows
│   ├── orchestrator.ts           # Main agent coordinator
│   ├── destination-researcher.ts # Research destinations
│   ├── transport-planner.ts      # Find transport options
│   ├── accommodation-finder.ts   # Find lodging
│   ├── activity-curator.ts       # Curate activities
│   ├── itinerary-builder.ts      # Auto-generate itineraries
│   ├── price-comparator.ts       # Compare prices across options
│   └── reminder-sender.ts        # Send nudges to crew
├── models/                       # Data models & types
│   └── types.ts
├── utils/                        # Utility functions
│   └── helpers.ts
└── styles/                       # Global styles
```

---

## Feature Breakdown

### Phase 1: MVP (Core Loop)

#### 1. Party Creation & Invite System
- Best man creates party (groom name, tentative dates, vibe)
- Generates shareable invite link (e.g., stagparty.io/join/epic-send-off-742)
- Crew joins via link — name, email, phone (minimal friction)
- RSVP: Confirmed / Maybe / Can't make it

#### 2. Voting System
- **Date Vote:** Calendar heat map — everyone marks available dates, system finds overlap
- **Destination Vote:** Ranked choice from suggested or custom options
- **Budget Vote:** Tiered options (Budget $200-400 / Moderate $400-700 / Premium $700-1200 / Baller $1200+)
- **Activity Vote:** Thumbs up/down on proposed activities
- Real-time results visible to all
- Best man can lock votes and set deadlines

#### 3. Itinerary Builder
- Day-by-day timeline view
- Drag-and-drop events
- Each event: time, location, cost, booking status, notes
- Print/share view for the trip

#### 4. Budget Tracker
- Per-person cost breakdown
- "Groom pays nothing" toggle (splits his share among the crew)
- Payment tracking (who's paid, who hasn't)
- Venmo/Zelle integration links

### Phase 2: AI Agent Workflows

#### 5. Destination Research Agent
- Input: vibe (adventure, party, chill), group size, budget, travel-from location
- Output: Top 5 destinations with pros/cons, estimated costs, travel logistics
- Example: "12 guys, adventure vibe, $500/person budget, coming from Orange County"
  → Catalina Island, Big Bear, Joshua Tree, Mammoth, San Diego

#### 6. Transport Planning Agent
- Compares routes, schedules, prices
- Example for Catalina:
  - Newport Beach → Avalon (Catalina Express) → shuttle to Two Harbors
  - San Pedro → Two Harbors (direct Catalina Express route)
  - Compares cost, travel time, convenience
  - Checks group rates

#### 7. Accommodation Agent
- Finds options matching group size and budget
- Catalina example: campsite reservations at Two Harbors, cabin options
- Compares: camping vs glamping vs hotel

#### 8. Activity Curator Agent
- Suggests activities based on destination + vibe
- Catalina: hiking Trans-Catalina Trail, snorkeling, kayaking, fishing, buffalo spotting
- Includes estimated costs and booking links

#### 9. Itinerary Generation Agent
- Takes all voted/confirmed choices and builds a complete day-by-day plan
- Accounts for travel times, meal breaks, group energy levels
- Outputs shareable itinerary

### Phase 3: Monetization

#### 10. Partner Deals Engine
- Local businesses register and offer bachelor party group deals
- Displayed contextually in the planning flow
- Example: "Catalina Express offers 10% off groups of 8+ — use code STAGPARTY"
- We earn affiliate commission (10-20%)

#### 11. Tiered Pricing

| Feature | Free | Pro ($29/event) | Premium ($79/event) |
|---|---|---|---|
| Create party | Yes | Yes | Yes |
| Invite crew (max) | 10 | 25 | Unlimited |
| Vote sessions | 3 | Unlimited | Unlimited |
| AI Agent workflows | 1 | 10 | Unlimited |
| Partner deals | View only | Bookable | Bookable + exclusive |
| Custom branding | No | No | Yes |
| Concierge support | No | No | Yes |
| Payment collection | No | Venmo links | Stripe split payments |

#### 12. B2B / White Label
- Destinations (Catalina, Vegas, Scottsdale, Nashville) can white-label the tool
- "Plan your Catalina Bachelor Party" — embedded on their tourism site
- They pay monthly SaaS fee + we earn booking commissions
- Activity providers get a dashboard to manage deals and track conversions

---

## Dan's Catalina Trip — Example Flow

```
1. Dan's best man creates "Dan's Epic Send-Off" on StagParty.io
2. Shares link: stagparty.io/join/dans-send-off-420
3. 11 guys join, RSVP confirmed
4. Vote: May 16-18 wins (10/11 available)
5. Destination already decided: Catalina Island - Two Harbors
6. Budget vote: Moderate ($400-500/person) wins
7. AI Agent researches transport:
   - Option A: Newport Beach → Avalon → shuttle to Two Harbors ($85 RT)
   - Option B: San Pedro → Two Harbors direct ($85 RT, 90 min, recommended)
   → Crew votes: San Pedro direct wins
8. AI Agent finds camping: Two Harbors campground, $38/night/site, need 3 sites
9. Activity Agent suggests: hiking, snorkeling, kayaking, harbor BBQ
10. Itinerary auto-generated:

    DAY 1 (Fri May 16):
    - 7:00 AM — Meet at San Pedro ferry terminal
    - 8:00 AM — Catalina Express to Two Harbors (90 min)
    - 9:30 AM — Arrive, set up camp
    - 11:00 AM — Hike to Parson's Landing (7 mi)
    - 4:00 PM — Back at camp, harbor swim
    - 6:00 PM — BBQ at campsite + beers
    - 9:00 PM — Bonfire on the beach

    DAY 2 (Sat May 17):
    - 8:00 AM — Breakfast at Harbor Reef Restaurant
    - 9:30 AM — Kayak rental (group rate via partner deal — 15% off)
    - 12:00 PM — Lunch at the harbor
    - 1:30 PM — Snorkeling at Blue Cavern
    - 4:00 PM — Free time / fishing
    - 6:30 PM — Dinner + roast the groom
    - 9:00 PM — Night hike to stargazing point

    DAY 3 (Sun May 18):
    - 8:00 AM — Pack up camp
    - 9:30 AM — Final harbor breakfast
    - 11:00 AM — Ferry back to San Pedro
    - 12:30 PM — Home

11. Budget breakdown: ~$420/person (groom's share split 10 ways = +$42 each)
    - Ferry: $85
    - Camping (2 nights): $25 (split across sites)
    - Food/drinks: $200
    - Activities: $80
    - Misc: $30

12. Best man sends payment request via app → tracks who's paid
13. All bookings confirmed via dashboard
```

---

## Implementation Order

1. **Now:** Initialize Next.js project, set up Tailwind, Prisma, basic routing
2. **Sprint 1:** Landing page, create party flow, invite/join system
3. **Sprint 2:** Voting system (dates, destination, budget, activities)
4. **Sprint 3:** Itinerary builder + budget tracker
5. **Sprint 4:** AI agent workflows (Claude API integration)
6. **Sprint 5:** Partner deals engine + monetization tiers
7. **Sprint 6:** Polish, mobile responsive, notifications

---

## Key Decisions Needed

1. **Database:** PostgreSQL (Supabase? Neon? Vercel Postgres?)
2. **Auth:** Magic links (low friction for crew) vs OAuth
3. **Realtime:** SSE vs WebSockets vs Pusher
4. **Domain:** stagparty.io? sendoff.app? bachelorparty.co?
