"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface PartyNavProps {
  partyId: string;
  partyName: string;
}

const navItems = [
  { label: "Dashboard", path: "", icon: "📊" },
  { label: "Voting", path: "/vote", icon: "🗳️" },
  { label: "Itinerary", path: "/itinerary", icon: "📋" },
  { label: "Budget", path: "/budget", icon: "💰" },
  { label: "Crew", path: "/crew", icon: "👥" },
  { label: "AI Agents", path: "/agents", icon: "🤖" },
  { label: "Deals", path: "/marketplace", icon: "🏷️" },
];

export function PartyNav({ partyId, partyName }: PartyNavProps) {
  const pathname = usePathname();
  const basePath = `/party/${partyId}`;

  return (
    <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-amber-500 font-bold text-xl">
              StagParty
            </Link>
            <span className="text-white/30">|</span>
            <span className="text-white font-medium truncate max-w-[200px]">
              {partyName}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const href = `${basePath}${item.path}`;
              const isActive =
                item.path === ""
                  ? pathname === basePath
                  : pathname === href;

              return (
                <Link
                  key={item.path}
                  href={href}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-amber-500/20 text-amber-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
