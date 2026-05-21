"use client";
import { useState } from "react";
import FMSLayout from "@/components/FMSLayout";

type Region = "SEA" | "BR";

const REGIONS: { key: Region; label: string; subtitle: string; active: string; inactive: string }[] = [
  { key: "SEA", label: "SEA", subtitle: "Southeast Asia", active: "border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-200", inactive: "border-violet-200 bg-white text-gray-500 hover:border-violet-400" },
  { key: "BR",  label: "BR",  subtitle: "Brazil",         active: "border-green-600 bg-green-600 text-white shadow-lg shadow-green-200",   inactive: "border-green-200  bg-white text-gray-500 hover:border-green-400"  },
];

export default function DriverAppOverviewPage() {
  const [region, setRegion] = useState<Region>("SEA");
  return (
    <FMSLayout breadcrumbs={[{ label: "Driver App" }, { label: region }]}>
      <div className="flex gap-4 mb-8">
        {REGIONS.map((r) => {
          const isActive = region === r.key;
          return (
            <button key={r.key} onClick={() => setRegion(r.key)}
              className={`relative w-52 py-5 rounded-2xl border-2 text-center transition-all duration-200 ${isActive ? r.active : r.inactive}`}>
              {isActive && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 inline-block" />}
              <div className="text-3xl font-extrabold tracking-wide">{r.label}</div>
              <div className={`text-xs mt-1 font-medium ${isActive ? "text-white/80" : "text-gray-400"}`}>{r.subtitle}</div>
            </button>
          );
        })}
      </div>
      {region === "SEA" ? <SeaContent /> : <BrContent />}
    </FMSLayout>
  );
}

// ── Phone shell ───────────────────────────────────────────────────────────────
function PhoneShell({ children, bg = "bg-white" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className={`rounded-[2.5rem] border-[5px] border-gray-800 shadow-xl overflow-hidden w-64 flex flex-col ${bg}`}>
      {children}
      <div className={`flex justify-center py-2 flex-shrink-0 ${bg}`}>
        <div className="w-14 h-1 bg-black/20 rounded-full" />
      </div>
    </div>
  );
}

// ── Mockup: Popup notification ────────────────────────────────────────────────
function PopupMockup() {
  return (
    <PhoneShell bg="bg-gray-500">
      <div className="bg-gray-500 flex-1 flex items-center justify-center px-4 py-6 min-h-[32rem]">
        <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden">
          <div className="px-5 pt-5 pb-4 text-center">
            <p className="font-bold text-gray-900 text-sm mb-2">Driver Preference</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Please set the working day&apos;s shifts and your preferred clusters for next week.
            </p>
          </div>
          <div className="border-t border-gray-100 flex">
            <button className="flex-1 py-3 text-sm text-gray-400">Later</button>
            <div className="w-px bg-gray-100" />
            <button className="flex-1 py-3 text-sm text-orange-500 font-semibold">Set Now</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Mockup: Working Day & Shifts ─────────────────────────────────────────────
const NEXT_WEEK_DAYS = [
  { day: "Monday",    date: "May 12", shifts: ["07:00-11:30", "14:00-17:00", "19:30-21:30", "22:00-23:30"], nonOp: false },
  { day: "Tuesday",   date: "May 13", shifts: ["07:00-11:30", "14:00-17:00", "19:30-21:30"],                nonOp: true  },
  { day: "Wednesday", date: "May 14", shifts: ["07:00-11:30", "14:00-17:00", "19:30-21:30"],                nonOp: false },
  { day: "Thursday",  date: "May 15", shifts: [] as string[],                                               nonOp: false, noShift: true },
  { day: "Friday",    date: "May 16", shifts: ["07:00-11:30", "19:30-21:30"],                               nonOp: false },
  { day: "Saturday",  date: "May 17", shifts: ["07:00-11:30", "14:00-17:00", "19:30-21:30"],                nonOp: false },
  { day: "Sunday",    date: "May 18", shifts: ["07:00-11:30", "14:00-17:00"],                               nonOp: true  },
];

function WorkingDayMockup() {
  return (
    <PhoneShell>
      <div className="bg-white flex flex-col">
        <div className="flex justify-end items-center gap-1.5 px-3 pt-1.5 pb-0.5">
          <div className="w-3 h-1.5 border border-gray-600 rounded-sm"><div className="h-full w-2/3 bg-gray-600 rounded-sm" /></div>
          <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold text-gray-900 text-sm">Working Day &amp; Shifts</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] text-gray-500 font-medium">Next Week · May 12 – 18</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" className="w-3 h-3 accent-red-500" readOnly />
            <span className="text-[10px] text-gray-600 font-medium">All Shifts</span>
          </label>
        </div>
        <div className="flex-1 divide-y divide-gray-50 px-3">
          {NEXT_WEEK_DAYS.map((d) => (
            <div key={d.day} className="py-2">
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-gray-800">{d.day}</span>
                {d.nonOp && <span className="text-[8px] border border-orange-400 text-orange-500 px-1 py-0.5 rounded leading-tight">Non-operation Day</span>}
              </div>
              {d.noShift ? (
                <span className="text-[9px] text-gray-400 italic">No shift</span>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {d.shifts.map((s) => (
                    <label key={s} className="flex items-center gap-1 bg-gray-50 rounded px-1.5 py-1 cursor-pointer">
                      <input type="checkbox" className="w-2.5 h-2.5 accent-red-500 flex-shrink-0" readOnly />
                      <span className="text-[8px] text-gray-600 leading-tight">{s}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 pt-2 border-t border-gray-100">
          <button className="w-full bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl">Confirm</button>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Mockup: Preferred Clusters ────────────────────────────────────────────────
const CLUSTER_LIST = ["Cluster_1_10", "Cluster_2_05", "Cluster_3_08"];

function ClusterMockup() {
  return (
    <PhoneShell>
      <div className="bg-white flex flex-col">
        <div className="flex justify-end items-center gap-1.5 px-3 pt-1.5 pb-0.5">
          <div className="w-3 h-1.5 border border-gray-600 rounded-sm"><div className="h-full w-2/3 bg-gray-600 rounded-sm" /></div>
          <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold text-gray-900 text-sm">Preferred Clusters</span>
        </div>
        {/* Map area */}
        <div className="relative bg-slate-200 h-36 overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(100,116,139,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.15) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          {/* Street-like lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 144" preserveAspectRatio="none">
            <line x1="0" y1="72" x2="256" y2="72" stroke="#94a3b8" strokeWidth="1.5"/>
            <line x1="128" y1="0" x2="128" y2="144" stroke="#94a3b8" strokeWidth="1.5"/>
            <line x1="0" y1="36" x2="256" y2="36" stroke="#cbd5e1" strokeWidth="0.8"/>
            <line x1="0" y1="108" x2="256" y2="108" stroke="#cbd5e1" strokeWidth="0.8"/>
            <line x1="64" y1="0" x2="64" y2="144" stroke="#cbd5e1" strokeWidth="0.8"/>
            <line x1="192" y1="0" x2="192" y2="144" stroke="#cbd5e1" strokeWidth="0.8"/>
            <polygon points="55,20 155,18 170,65 140,105 60,110 35,68" fill="rgba(59,130,246,0.2)" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3"/>
          </svg>
          <div className="absolute" style={{ top: "48%", left: "45%", transform: "translate(-50%,-50%)" }}>
            <span className="text-[9px] text-blue-700 font-bold bg-white/90 px-1.5 py-0.5 rounded shadow-sm">Cluster_1_10</span>
          </div>
        </div>
        {/* Blue info banner */}
        <div className="mx-3 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold">i</span>
          </div>
          <p className="text-[9px] text-blue-700 leading-relaxed">Please select at least 3 clusters. The earlier the selection, the higher the priority.</p>
        </div>
        {/* All Clusters */}
        <div className="px-3 py-2 border-b border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 accent-red-500" readOnly />
            <span className="text-xs text-gray-700 font-medium">All Clusters</span>
          </label>
        </div>
        {/* Cluster list */}
        <div className="px-3 py-2 flex flex-col gap-1.5">
          {CLUSTER_LIST.map((c, i) => (
            <label key={c} className="flex items-center gap-2 py-1.5 px-2 bg-gray-50 rounded-lg cursor-pointer">
              <input type="checkbox" className="w-3 h-3 accent-red-500" defaultChecked={i === 0} readOnly />
              <span className="text-[10px] text-gray-700">{c}</span>
            </label>
          ))}
        </div>
        <div className="px-3 pb-3 pt-1 border-t border-gray-100">
          <button className="w-full bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl">Confirm</button>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Mockup: Driver Preference screen ─────────────────────────────────────────
const THIS_WEEK_DAYS = [
  { day: "Monday, May 8",     shifts: "07:00 - 11:30, 14:00 - 17:00, 19:30 - 21:30",               nonOp: false },
  { day: "Tuesday, May 9",    shifts: "07:00 - 11:30, 14:00 - 17:00, 19:30 - 21:30",               nonOp: true  },
  { day: "Wednesday, May 10", shifts: "07:00 - 11:30, 14:00 - 17:00, 19:30 - 21:30, 22:00 - 23:30",nonOp: false },
  { day: "Friday, May 12",    shifts: "10:00 - 11:30",                                              nonOp: false },
];

function PreferenceMockup() {
  return (
    <PhoneShell>
      <div className="bg-white flex flex-col">
        <div className="flex justify-end items-center gap-1.5 px-3 pt-1.5 pb-0.5">
          <div className="w-3 h-1.5 border border-gray-600 rounded-sm"><div className="h-full w-2/3 bg-gray-600 rounded-sm" /></div>
          <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold text-gray-900 text-sm">Driver Preference</span>
        </div>
        <div className="flex border-b border-gray-200">
          <div className="flex-1 text-center py-2 text-[10px] font-semibold text-red-500 border-b-2 border-red-500">Working Day &amp; Shifts</div>
          <div className="flex-1 text-center py-2 text-[10px] text-gray-400">Preferred Clusters</div>
        </div>
        {/* Next Week */}
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-900">Next Week</span>
            <span className="text-[10px] text-blue-500 font-medium">Edit</span>
          </div>
          <div className="flex flex-col items-center py-2 gap-1">
            <div className="relative w-9 h-9 mb-0.5">
              <svg className="w-9 h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <span className="text-orange-400 text-[10px] font-semibold">Pending Set</span>
          </div>
        </div>
        {/* This Week */}
        <div className="px-3 py-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-900">This Week</span>
            <span className="text-[10px] text-blue-500 font-medium">Edit</span>
          </div>
          <div className="flex flex-col gap-3">
            {THIS_WEEK_DAYS.map((d) => (
              <div key={d.day} className="flex gap-2 items-start">
                <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0 mt-1" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[10px] font-semibold text-gray-800">{d.day}</span>
                    {d.nonOp && <span className="text-[8px] border border-orange-400 text-orange-500 px-1 py-0.5 rounded leading-tight whitespace-nowrap">Non-operation Day</span>}
                  </div>
                  <span className="text-[9px] text-gray-400 leading-tight block mt-0.5">{d.shifts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── TBC placeholder ───────────────────────────────────────────────────────────
function TbcPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 gap-2">
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-xs font-semibold text-gray-400">Mockup TBC</p>
    </div>
  );
}

// ── Phase connector arrow ─────────────────────────────────────────────────────
function PhaseArrow() {
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-start pt-10 px-1">
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

// ── Mockup: Availability Confirmation ────────────────────────────────────────
const AVAIL_SLOTS = ["07:00 - 11:30", "14:00 - 17:00", "19:30 - 21:30"];

function AvailabilityMockup() {
  return (
    <PhoneShell>
      <div className="bg-white flex flex-col">
        {/* Status bar */}
        <div className="flex justify-end items-center gap-1.5 px-3 pt-1.5 pb-0.5">
          <div className="w-3 h-1.5 border border-gray-600 rounded-sm"><div className="h-full w-2/3 bg-gray-600 rounded-sm" /></div>
          <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
          <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"/></svg>
        </div>
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-bold text-gray-900 text-sm">Availability Confirmation</span>
        </div>
        {/* Warning banner */}
        <div className="mx-3 mt-3 mb-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-[8px] font-bold">!</span>
          </div>
          <p className="text-[9px] text-amber-700 leading-relaxed">Please confirm your availability for tomorrow before today 23:59:59</p>
        </div>
        {/* Date + badge */}
        <div className="flex items-center gap-2 px-3 pt-4 pb-3 flex-wrap">
          <span className="text-xs font-bold text-gray-900">Monday, April 8</span>
          <span className="text-[8px] border border-orange-400 text-orange-500 px-1.5 py-0.5 rounded whitespace-nowrap">Non-operation Day</span>
        </div>
        {/* Time slots */}
        <div className="px-3 flex flex-col gap-2">
          {AVAIL_SLOTS.map((slot) => (
            <div key={slot} className="border border-red-300 bg-red-50 rounded-lg py-2 text-center">
              <span className="text-xs text-red-400 font-medium">{slot}</span>
            </div>
          ))}
        </div>
        {/* Confirm button */}
        <div className="px-3 mt-5">
          <button className="w-full bg-red-500 text-white text-sm font-semibold py-3 rounded-xl">Confirm</button>
        </div>
        {/* Not available link */}
        <p className="text-center text-[10px] text-red-400 font-medium py-3">Not available for tomorrow</p>
      </div>
    </PhoneShell>
  );
}

// ── Mockup: Route Assignment (Call-up) ────────────────────────────────────────
const ROUTE_DETAILS = [
  { label: "Route Hub",       value: "LM Hub_SP_São José dos Campos" },
  { label: "Parcel Number",   value: "3" },
  { label: "Date of Shift",   value: "2025-07-02" },
  { label: "Time of Shift",   value: "15:00 - 23:59" },
  { label: "Cluster Name",    value: "Cluster_1_10" },
  { label: "Total Distance",  value: "28745.00km" },
];

function CallupMockup() {
  return (
    <PhoneShell bg="bg-gray-600">
      <div className="bg-gray-600 flex flex-col">
        {/* App background hint */}
        <div className="flex items-center justify-center gap-1.5 py-3">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
          <span className="text-gray-300 text-xs">Show on map</span>
        </div>
        {/* Modal card */}
        <div className="mx-3 bg-white rounded-2xl overflow-hidden shadow-xl">
          {/* Modal header */}
          <div className="px-5 pt-5 pb-3 text-center border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">SPX Assignment</p>
            <p className="text-gray-400 text-xs mt-1">You have received a new route.</p>
          </div>
          {/* Detail rows */}
          <div className="px-4 py-2 divide-y divide-gray-50">
            {ROUTE_DETAILS.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-2 py-2">
                <span className="text-[10px] text-gray-500 flex-shrink-0">{row.label}</span>
                <span className="text-[10px] text-gray-800 font-medium text-right">{row.value}</span>
              </div>
            ))}
          </div>
          {/* Action buttons */}
          <div className="border-t border-gray-100 flex">
            <button className="flex-1 py-3 text-sm text-gray-400">Decline</button>
            <div className="w-px bg-gray-100" />
            <button className="flex-1 py-3 text-sm text-orange-500 font-semibold">Accept</button>
          </div>
        </div>
        {/* Scan bar */}
        <div className="mx-3 mt-3 bg-red-800 rounded-xl flex items-center justify-center gap-2 py-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m0 14v1M4 12h1m14 0h1M6.343 6.343l.707.707m9.9 9.9l.707.707M6.343 17.657l.707-.707m9.9-9.9l.707-.707" /><rect x="7" y="7" width="10" height="10" rx="1" strokeWidth={1.5}/></svg>
          <span className="text-white text-sm font-medium">Scan</span>
        </div>
        <div className="h-3" />
      </div>
    </PhoneShell>
  );
}

// ── BR content — 3-phase horizontal layout ────────────────────────────────────
const PHASE_BADGE_COLOR: Record<string, string> = {
  "Week-1":    "bg-violet-100 text-violet-700",
  "D-1 / D-0": "bg-amber-100 text-amber-700",
  "D-0":       "bg-teal-100 text-teal-700",
};

function BrContent() {
  return (
    <div className="flex items-start gap-0">

      {/* ── Phase 1: Week-1 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${PHASE_BADGE_COLOR["Week-1"]}`}>Week-1</span>
          <h3 className="font-bold text-gray-800 text-sm">Set Working Preference</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Driver receives a push notification to set their working days, preferred shifts, and base cluster for next week.
          </p>
          <p className="text-xs text-blue-500 mt-2 leading-relaxed">
            ⓘ Notification trigger time is configured in the <span className="font-semibold">Driver Availability Config</span> module.
          </p>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">① Notification prompt</p>
          <PopupMockup />
          <div className="flex flex-col items-center gap-0.5 my-1">
            <div className="w-px h-3 bg-gray-300" />
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 14l-5-5h10l-5 5z"/></svg>
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">② Preference summary</p>
          <PreferenceMockup />
          <div className="flex flex-col items-center gap-0.5 my-1">
            <div className="w-px h-3 bg-gray-300" />
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 14l-5-5h10l-5 5z"/></svg>
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">③ Set working day &amp; shifts</p>
          <WorkingDayMockup />
          <div className="flex flex-col items-center gap-0.5 my-1">
            <div className="w-px h-3 bg-gray-300" />
            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 14l-5-5h10l-5 5z"/></svg>
          </div>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">④ Select preferred clusters</p>
          <ClusterMockup />
        </div>
      </div>

      <PhaseArrow />

      {/* ── Phase 2: D-1 / D-0 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${PHASE_BADGE_COLOR["D-1 / D-0"]}`}>D-1 / D-0 Morning</span>
          <h3 className="font-bold text-gray-800 text-sm">Confirm Availability</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            The evening before or morning of the shift, the driver confirms whether they are available for the scheduled timeslots.
          </p>
          <p className="text-xs text-blue-500 mt-2 leading-relaxed">
            ⓘ Notification trigger time is configured in the <span className="font-semibold">Driver Availability Config</span> module.
          </p>
          <p className="text-xs text-blue-500 mt-1 leading-relaxed">
            ⓘ Availability confirmation pop-up only appears on the days indicated by the driver during preference collection.
          </p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            ⚠ Declining or not answering the availability confirmation means the driver will not be assigned a route.
          </p>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Availability confirmation screen</p>
          <AvailabilityMockup />
        </div>
      </div>

      <PhaseArrow />

      {/* ── Phase 3: D-0 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${PHASE_BADGE_COLOR["D-0"]}`}>D-0</span>
          <h3 className="font-bold text-gray-800 text-sm">Confirm Route Assignment</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            On the day of operation, the driver confirms their assigned route in the app before departure.
          </p>
          <p className="text-xs text-blue-500 mt-2 leading-relaxed">
            ⓘ Call-up appears once a task is assigned to the driver by the system.
          </p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            ⚠ Declining the call-up means the driver will not be assigned to that route.
          </p>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Route assignment pop-up</p>
          <CallupMockup />
        </div>
      </div>

    </div>
  );
}

// ── Mockup: Availability Confirmation popup (SEA) ────────────────────────────
function SeaAvailabilityPopupMockup() {
  return (
    <PhoneShell bg="bg-gray-500">
      <div className="bg-gray-500 flex-1 flex items-center justify-center px-4 py-6 min-h-[32rem]">
        <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden">
          <div className="px-5 pt-5 pb-4 text-center">
            <p className="font-bold text-gray-900 text-sm mb-2">Availability Confirmation</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Please confirm your availability for tomorrow before today 23:59:59
            </p>
          </div>
          <div className="border-t border-gray-100 flex">
            <button className="flex-1 py-3 text-sm text-gray-400">Later</button>
            <div className="w-px bg-gray-100" />
            <button className="flex-1 py-3 text-sm text-orange-500 font-semibold">Confirm Now</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── Mockup: Route Assignment — Indonesia (SEA) ────────────────────────────────
const SEA_ROUTE_DETAILS = [
  { label: "Route Hub",      value: "LM Hub_ID_Jakarta Timur" },
  { label: "Parcel Number",  value: "38" },
  { label: "Date of Shift",  value: "2025-07-02" },
  { label: "Time of Shift",  value: "08:00 - 16:00" },
  { label: "Cluster Name",   value: "Cluster_ID_07" },
  { label: "Total Distance", value: "12450.00km" },
];

function SeaCallupMockup() {
  return (
    <PhoneShell bg="bg-gray-600">
      <div className="bg-gray-600 flex flex-col py-6">
        <div className="mx-3 bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 pt-5 pb-3 text-center border-b border-gray-100">
            <p className="font-bold text-gray-900 text-sm">SPX Assignment</p>
            <p className="text-gray-400 text-xs mt-1">You have received a new route.</p>
          </div>
          <div className="px-4 py-2 divide-y divide-gray-50">
            {SEA_ROUTE_DETAILS.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-2 py-2">
                <span className="text-[10px] text-gray-500 flex-shrink-0">{row.label}</span>
                <span className="text-[10px] text-gray-800 font-medium text-right">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 flex">
            <button className="flex-1 py-3 text-sm text-gray-400">Decline</button>
            <div className="w-px bg-gray-100" />
            <button className="flex-1 py-3 text-sm text-orange-500 font-semibold">Accept</button>
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

// ── SEA content — 2-phase horizontal layout ───────────────────────────────────
function SeaContent() {
  return (
    <div className="flex items-start gap-0">

      {/* ── Phase 1: D-1 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${PHASE_BADGE_COLOR["D-1 / D-0"]}`}>D-1</span>
          <h3 className="font-bold text-gray-800 text-sm">Confirm Availability</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            The evening before the shift, the driver receives a notification to confirm their availability for the next day.
          </p>
          <p className="text-xs text-blue-500 mt-2 leading-relaxed">
            ⓘ Notification trigger time is configured in the <span className="font-semibold">Driver Availability Config</span> module.
          </p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            ⚠ Declining or not answering the availability confirmation means the driver will not be assigned a route.
          </p>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Notification prompt</p>
          <SeaAvailabilityPopupMockup />
        </div>
      </div>

      <PhaseArrow />

      {/* ── Phase 2: D-0 ── */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${PHASE_BADGE_COLOR["D-0"]}`}>D-0</span>
          <h3 className="font-bold text-gray-800 text-sm">Confirm Route Assignment</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            On the day of operation, the driver confirms their assigned route in the app before departure.
          </p>
          <p className="text-xs text-blue-500 mt-2 leading-relaxed">
            ⓘ Call-up appears once a task is assigned to the driver by the system.
          </p>
          <p className="text-xs text-amber-600 mt-1 leading-relaxed">
            ⚠ Declining the call-up means the driver will not be assigned to that route.
          </p>
        </div>
        <div className="px-5 py-6 flex flex-col items-center gap-2">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Route assignment pop-up</p>
          <SeaCallupMockup />
        </div>
      </div>

    </div>
  );
}
