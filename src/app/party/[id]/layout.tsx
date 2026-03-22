import { PartyNav } from "@/components/party/nav";
import { mockParty } from "@/data/mock";

export default function PartyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  // In production: fetch party by ID from database
  const party = mockParty;

  return (
    <div className="min-h-screen bg-gray-950">
      <PartyNav partyId={party.id} partyName={party.name} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
