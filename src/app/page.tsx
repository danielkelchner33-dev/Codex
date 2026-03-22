import Link from "next/link";
import clsx from "clsx";

// ── Data ────────────────────────────────────────────────────

const steps = [
  { emoji: "✏️", title: "Create", description: "Set up the party in 60 seconds — name, dates, vibe." },
  { emoji: "📩", title: "Invite", description: "Share a link. The crew joins with one tap." },
  { emoji: "🗳️", title: "Vote", description: "Destination, dates, activities — everyone gets a say." },
  { emoji: "🎉", title: "Party", description: "Follow the smart itinerary. We handle logistics." },
] as const;

const features: { icon: string; title: string; description: string }[] = [
  {
    icon: "🤖",
    title: "AI Research Agent",
    description:
      "Our AI scouts destinations, compares prices, and finds hidden gems tailored to your group.",
  },
  {
    icon: "🗳️",
    title: "Group Voting",
    description:
      "Democratic decision-making. Ranked-choice voting on destinations, dates, and activities.",
  },
  {
    icon: "📋",
    title: "Smart Itinerary",
    description:
      "Auto-generated day-by-day plans with travel times, reservations, and backup options.",
  },
  {
    icon: "💰",
    title: "Budget Tracker",
    description:
      "Set per-person budgets, split costs, and track who has paid. The groom pays nothing.",
  },
  {
    icon: "📍",
    title: "Live Day-Of Mode",
    description:
      "Real-time itinerary with maps, check-in times, and push notifications so nobody gets lost.",
  },
  {
    icon: "🤝",
    title: "Partner Deals",
    description:
      "Exclusive discounts on hotels, restaurants, and activities from our vetted partner network.",
  },
];

const testimonials = [
  {
    quote:
      "We planned a Vegas trip for 14 guys in under a week. The voting feature alone saved us 200 messages in the group chat.",
    name: "Mike R.",
    role: "Best Man",
  },
  {
    quote:
      "The AI found us a lake house deal that was $80/person cheaper than anything we found on our own. Absolute game-changer.",
    name: "Jake T.",
    role: "Best Man",
  },
  {
    quote:
      "Day-of mode kept everyone on schedule. First bachelor party where we actually made every reservation.",
    name: "Chris D.",
    role: "Groomsman",
  },
];

// ── Page ────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Nav ──────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="gradient-gold-text">Stag</span>Party.io
          </Link>

          <div className="hidden sm:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#how-it-works" className="hover:text-text-primary transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-text-primary transition-colors">
              Features
            </a>
            <a href="#testimonials" className="hover:text-text-primary transition-colors">
              Testimonials
            </a>
          </div>

          <Link
            href="/create"
            className="rounded-[var(--radius-button)] bg-gold-500 px-5 py-2 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
          >
            Start Planning
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────── */}
        <section className="relative isolate flex flex-col items-center justify-center px-6 pt-36 pb-24 text-center sm:pt-44 sm:pb-32">
          {/* Decorative radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gold-500/5 blur-[120px]"
          />

          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-gold-400">
            AI-Powered Bachelor Party Planning
          </p>

          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Plan the{" "}
            <span className="shimmer-gold">Ultimate</span>{" "}
            Bachelor Party
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            From destination research to day-of logistics, StagParty.io uses AI to handle the
            heavy lifting so you can focus on making memories. Invite the crew, vote on
            everything, and show up ready to celebrate.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/create"
              className="gradient-gold glow-gold rounded-[var(--radius-button)] px-8 py-3.5 text-base font-bold text-navy-950 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Planning (It&apos;s Free)
            </Link>
            <a
              href="#how-it-works"
              className="rounded-[var(--radius-button)] border border-navy-600 px-8 py-3.5 text-base font-semibold text-text-secondary transition-colors hover:border-gold-500/40 hover:text-text-primary"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-6 text-xs text-text-muted">
            No credit card required. Free for groups up to 10.
          </p>
        </section>

        {/* ── How It Works ───────────────────────────────── */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Four Steps to an{" "}
            <span className="gradient-gold-text">Epic Send-Off</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
            No spreadsheets. No endless group chats. Just a clean workflow that gets
            everyone aligned.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={clsx(
                  "card-glass rounded-[var(--radius-card)] p-6 text-center transition-transform hover:-translate-y-1",
                )}
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-700 text-2xl">
                  {step.emoji}
                </div>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ───────────────────────────────────── */}
        <section id="features" className="border-y border-navy-800/60 bg-navy-900/40 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold sm:text-4xl">
              Everything You Need.{" "}
              <span className="gradient-gold-text">Nothing You Don&apos;t.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
              Built by best men who were tired of planning in spreadsheets and group texts.
            </p>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="card-glass rounded-[var(--radius-card)] p-6 transition-all hover:border-gold-500/30 hover:glow-gold"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ───────────────────────────────── */}
        <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Trusted by{" "}
            <span className="gradient-gold-text">Best Men Everywhere</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
            Join thousands of groomsmen who planned stress-free bachelor parties.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.name}
                className="card-glass flex flex-col justify-between rounded-[var(--radius-card)] p-6"
              >
                <p className="text-sm leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-400">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ─────────────────────────────────── */}
        <section className="border-t border-navy-800/60 bg-navy-900/40 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to Send Him Off in{" "}
              <span className="gradient-gold-text">Style</span>?
            </h2>
            <p className="mt-4 text-text-secondary">
              Create a party in under a minute. It&apos;s free for groups up to 10.
            </p>
            <Link
              href="/create"
              className="mt-8 inline-block gradient-gold glow-gold rounded-[var(--radius-button)] px-10 py-4 text-lg font-bold text-navy-950 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Planning (It&apos;s Free)
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-navy-800/60 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-4">
          <div>
            <p className="text-lg font-bold">
              <span className="gradient-gold-text">Stag</span>Party.io
            </p>
            <p className="mt-2 text-sm text-text-muted">
              AI-powered bachelor party planning for the modern best man.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li><a href="#how-it-works" className="hover:text-text-primary">How it Works</a></li>
              <li><a href="#features" className="hover:text-text-primary">Features</a></li>
              <li><Link href="/create" className="hover:text-text-primary">Create a Party</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Company
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-text-primary">About</a></li>
              <li><a href="#" className="hover:text-text-primary">Blog</a></li>
              <li><a href="#" className="hover:text-text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Legal
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl border-t border-navy-800/60 px-6 pt-6">
          <p className="text-center text-xs text-text-muted">
            &copy; {new Date().getFullYear()} StagParty.io. All rights reserved. Plan responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}
