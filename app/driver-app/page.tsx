"use client";
import FMSLayout from "@/components/FMSLayout";

const improvements = [
  {
    title: "Shared Task Visibility",
    description:
      "Drivers in the same FM Group can now see all pickup tasks assigned to the Main Driver on their Driver App, giving every member full situational awareness of the group's workload.",
  },
  {
    title: "Group Pick-up & On-hold Actions",
    description:
      "Any driver in the group can act on parcels assigned to the Main Driver — picking them up or placing them on hold — reducing bottlenecks when the Main Driver is busy or unavailable.",
  },
  {
    title: "Real-time Task Status Updates",
    description:
      "Task statuses update live across all group members' apps. When one driver acts on a parcel, every member immediately sees the updated status — including who performed the action and any on-hold reason — without needing to refresh.",
  },
  {
    title: "Quick Pickup (Maintained)",
    description:
      "Drivers can still perform quick pickups for ad-hoc parcels outside of their assigned tasks. This existing capability is preserved and works seamlessly alongside the new group features.",
  },
  {
    title: "Individual Hub Handover",
    description:
      "When returning to the hub, each driver can only handover parcels they personally picked up. Station ops see a separate handover list per driver — team members cannot scan or handover items collected by the Team Lead, and vice versa.",
  },
];

interface Card {
  name: string;
  id: string;
  addr: string;
  shops: number;
  orders: number;
  status?: "picking-up" | "on-hold";
  actionBy?: string;
  actionRole?: string;
  holdReason?: string;
}

const CARDS: Card[] = [
  {
    name: "TAMAN SARI",
    id: "PT 202105242Y080",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 desa.jatake kec.pagedangan-tangerang",
    shops: 3,
    orders: 25,
  },
  {
    name: "PUP Name Test",
    id: "PT 202105242Y081",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 desa.jatake",
    shops: 1,
    orders: 0,
    status: "picking-up",
    actionBy: "Ahmad Rizal",
    actionRole: "Team Member",
  },
  {
    name: "SP Kontrakan 01",
    id: "PT 202105242Y082",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 pagedangan-tangerang",
    shops: 3,
    orders: 25,
    status: "on-hold",
    actionBy: "Budi Santoso",
    actionRole: "Team Member",
    holdReason: "Shop is closed",
  },
];

interface HandoverCard {
  name: string;
  id: string;
  addr: string;
  orders: number;
}

const HANDOVER_LEAD: HandoverCard[] = [
  {
    name: "TAMAN SARI",
    id: "PT 202105242Y080",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 desa.jatake kec.pagedangan-tangerang",
    orders: 25,
  },
  {
    name: "SP Kontrakan 01",
    id: "PT 202105242Y082",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 pagedangan-tangerang",
    orders: 15,
  },
];

const HANDOVER_MEMBER: HandoverCard[] = [
  {
    name: "PUP Name Test",
    id: "PT 202105242Y081",
    addr: "Kontrakan H.yono Kp. Cijantra girang RT 05/03 desa.jatake",
    orders: 12,
  },
];

const STATUS_STYLE = {
  "picking-up": { badge: "bg-blue-100 text-blue-600",    label: "Picking Up" },
  "on-hold":    { badge: "bg-orange-100 text-orange-600", label: "On Hold"    },
};

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden w-64">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-gray-800">
          <span className="text-white text-sm font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2 border border-white/60 rounded-sm">
              <div className="h-full w-2/3 bg-white/60 rounded-sm" />
            </div>
            <div className="w-1.5 h-2 bg-white/60 rounded-sm" />
          </div>
        </div>
        {children}
        {/* Home indicator */}
        <div className="flex justify-center py-2.5 bg-white">
          <div className="w-24 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
      <span className="text-base font-semibold text-gray-700">{label}</span>
    </div>
  );
}

function PhoneMockup({ label }: { label: string }) {
  return (
    <PhoneFrame label={label}>
      <div className="bg-white flex flex-col">
        {/* App header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h2l2 4-2 1.5a11 11 0 004.5 4.5L12 11l4 2v2a1 1 0 01-1 1A15 15 0 013 4z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">Pickup</span>
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 text-center py-3 text-sm text-red-600 font-semibold border-b-2 border-red-500">To-pickup (18)</div>
          <div className="flex-1 text-center py-3 text-sm text-gray-500">To-handover (8)</div>
          <div className="flex-1 text-center py-3 text-sm text-gray-500">Ended (16)</div>
        </div>

        {/* Cards */}
        {CARDS.map((card) => {
          const s = card.status ? STATUS_STYLE[card.status] : null;
          return (
            <div key={card.id} className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-gray-900">{card.name}</p>
                {s && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                    {card.status === "picking-up" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                    )}
                  </div>
                )}
              </div>

              {card.actionBy && (
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{card.actionBy} <span className="text-gray-300">·</span> {card.actionRole}</span>
                  </div>
                  {card.holdReason && (
                    <div className="flex items-start gap-1 text-xs text-orange-400">
                      <svg className="w-3 h-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span>{card.holdReason}</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-400 mt-1.5">{card.id}</p>
              <p className="text-sm text-gray-600 mt-1.5 leading-snug">{card.addr}</p>
              <div className="flex gap-4 mt-3">
                <span className={`text-sm flex items-center gap-1.5 ${card.orders === 0 ? "text-red-500" : "text-gray-500"}`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                  </svg>
                  {card.shops} Shops
                </span>
                <span className={`text-sm flex items-center gap-1.5 ${card.orders === 0 ? "text-red-500" : "text-gray-500"}`}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {card.orders} Orders
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </PhoneFrame>
  );
}

function HandoverPhoneMockup({ label, cards }: { label: string; cards: HandoverCard[] }) {
  return (
    <PhoneFrame label={label}>
      <div className="bg-white flex flex-col">
        {/* App header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
              <div className="w-5 h-0.5 bg-gray-700 rounded" />
            </div>
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
              <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h2l2 4-2 1.5a11 11 0 004.5 4.5L12 11l4 2v2a1 1 0 01-1 1A15 15 0 013 4z" />
              </svg>
              <span className="text-sm text-gray-700 font-medium">Pickup</span>
              <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Tabs — To-handover active */}
        <div className="flex border-b border-gray-200">
          <div className="flex-1 text-center py-3 text-sm text-gray-500">To-pickup (18)</div>
          <div className="flex-1 text-center py-3 text-sm text-red-600 font-semibold border-b-2 border-red-500">
            To-handover ({cards.length})
          </div>
          <div className="flex-1 text-center py-3 text-sm text-gray-500">Ended (16)</div>
        </div>

        {/* Handover cards */}
        {cards.map((card) => (
          <div key={card.id} className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-gray-900">{card.name}</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                Picked Up
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{card.id}</p>
            <p className="text-sm text-gray-600 mt-1 leading-snug">{card.addr}</p>
            <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {card.orders} Orders
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}

function Callout({ number, title, children }: { number: number; title: string; children: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 w-40 flex-shrink-0">
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </div>
        <p className="text-xs font-semibold text-blue-900 leading-tight">{title}</p>
      </div>
      <p className="text-xs text-blue-700 leading-relaxed">{children}</p>
    </div>
  );
}

export default function DriverAppPage() {
  return (
    <FMSLayout breadcrumbs={[{ label: "Driver App" }]}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Driver App — What&apos;s New</h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            The following improvements have been rolled out to the SPX Driver App as part of the Pickup Group initiative.
            These changes improve task clarity, reduce driver errors, and align the app experience with the new
            fleet management workflow configured in FMS.
          </p>
        </div>

        {/* Mockup showcase */}
        <div className="bg-white rounded border border-gray-200 p-8 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-8">App Screen Preview</h2>

          {/* ── Pickup view ── */}
          <div className="flex items-start justify-center gap-4">
            {/* Left callouts */}
            <div className="flex flex-col gap-3 pt-28 flex-shrink-0">
              <Callout number={1} title="Shared Task Visibility">
                Both Team Lead and Members see all group tasks — no one is flying blind.
              </Callout>
              <Callout number={3} title="Real-time Status">
                Status badges update instantly across all group members&apos; devices when anyone acts.
              </Callout>
              <Callout number={5} title="Action Transparency">
                The acting driver&apos;s name and any on-hold reason are clearly shown on every card.
              </Callout>
            </div>

            <PhoneMockup label="Team Lead" />
            <PhoneMockup label="Team Member" />

            {/* Right callouts */}
            <div className="flex flex-col gap-3 pt-28 flex-shrink-0">
              <Callout number={2} title="Group Pick-up & On-hold">
                Any member can pick up or on-hold parcels assigned to the Main Driver.
              </Callout>
              <Callout number={4} title="Quick Pickup (Maintained)">
                Drivers can still perform quick pickups for ad-hoc parcels outside group tasks.
              </Callout>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Hub Handover — Individual View
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Handover view ── */}
          <div className="flex items-start justify-center gap-8">
            <HandoverPhoneMockup label="Team Lead" cards={HANDOVER_LEAD} />

            <div className="flex flex-col items-center justify-center pt-16 flex-shrink-0 max-w-[180px]">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    6
                  </div>
                  <p className="text-xs font-semibold text-blue-900 leading-tight">Individual Hub Handover</p>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Each driver only sees parcels <strong>they personally picked up</strong>. Team members cannot handover
                  the Team Lead&apos;s parcels — and vice versa.
                </p>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center leading-relaxed">
                Team Lead picked up <strong className="text-gray-600">2 PUPs</strong>, Team Member picked up{" "}
                <strong className="text-gray-600">1 PUP</strong> — handover lists differ accordingly.
              </div>
            </div>

            <HandoverPhoneMockup label="Team Member" cards={HANDOVER_MEMBER} />
          </div>

          <p className="text-xs text-gray-400 text-center mt-8">
            * Screens shown are representative mockups. Status badges and driver details reflect live group actions.
          </p>
        </div>

        {/* Improvement cards */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Key Improvements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {improvements.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FMSLayout>
  );
}
