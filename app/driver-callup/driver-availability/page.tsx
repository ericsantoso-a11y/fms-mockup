"use client";
import { useState } from "react";
import FMSLayout from "@/components/FMSLayout";

// ── Types ─────────────────────────────────────────────────────────────────────
type ShiftStatus = "preference" | "avail-confirmed" | "callup-confirmed" | "callup-declined" | "ignored";
type ShiftEntry  = { time: string; status: ShiftStatus };
type DayData     =
  | { type: "not-available" }
  | { type: "pending" }
  | { type: "shifts"; shifts: ShiftEntry[] };

interface DriverRow {
  stationId:    string;
  stationName:  string;
  cutOffTime:   string;
  driverId:     string;
  driverName:   string;
  phone:        string;
  noShowCount:  number;
  isNewDriver:  boolean;
  availability: Record<string, DayData>;
}

// ── Dates ─────────────────────────────────────────────────────────────────────
const DATES = [
  { key: "05-21", day: "Thu", isToday: true },
  { key: "05-22", day: "Fri" },
  { key: "05-23", day: "Sat" },
  { key: "05-24", day: "Sun" },
  { key: "05-25", day: "Mon" },
  { key: "05-26", day: "Tue" },
  { key: "05-27", day: "Wed" },
];

const s    = (shifts: ShiftEntry[]): DayData => ({ type: "shifts", shifts });
const pref = (time: string): ShiftEntry => ({ time, status: "preference" });
const ac   = (time: string): ShiftEntry => ({ time, status: "avail-confirmed" });
const cc   = (time: string): ShiftEntry => ({ time, status: "callup-confirmed" });
const cdec = (time: string): ShiftEntry => ({ time, status: "callup-declined" });
const ign  = (time: string): ShiftEntry => ({ time, status: "ignored" });
const NA:  DayData = { type: "not-available" };
const PEN: DayData = { type: "pending" };

// ── Mock data ─────────────────────────────────────────────────────────────────
// 05-21 Thu (Today): call-up statuses only
// 05-22 Fri: mix of avail-confirmed + preference, some NA
// 05-23 Sat: preference only, some NA
// 05-24 Sun: preference only, some NA
// 05-25 Mon: Pending Set Shift
// 05-26 Tue: preference or NA (not pending)
// 05-27 Wed: Pending Set Shift
const OWN_FLEET_DRIVERS: DriverRow[] = [
  {
    // Today: all ignored
    stationId: "3142", stationName: "FMHub B", cutOffTime: "21:00",
    driverId: "4085", driverName: "LEANDRO DE GOES MACHADO",
    phone: "62198765432", noShowCount: 2, isNewDriver: false,
    availability: {
      "05-21": s([ign("06:00-14:00"), ign("14:00-22:00")]),
      "05-22": s([pref("06:00-14:00"), ac("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: callup-confirmed both shifts
    stationId: "7819", stationName: "FMHub G", cutOffTime: "23:59",
    driverId: "4083", driverName: "HELLEN CRISTINA PIACESKI DOS SANTOS",
    phone: "62187654321", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": s([cc("06:00-14:00"), cc("14:00-22:00")]),
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-24": s([pref("06:00-14:00")]),
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: decline callup morning + callup-confirmed afternoon
    stationId: "2456", stationName: "FMHub K", cutOffTime: "23:59",
    driverId: "4082", driverName: "SAYARA NIELLE DUPRAT SANTOS",
    phone: "62176543210", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": s([cdec("06:00-14:00"), cc("14:00-22:00")]),
      "05-22": s([pref("06:00-14:00"), ac("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: callup-confirmed morning + avail-confirmed afternoon
    stationId: "9023", stationName: "FMHub P", cutOffTime: "23:59",
    driverId: "4081", driverName: "THALLES HENRIQUE EUZEBIO DA SILVA",
    phone: "62165432109", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": s([cc("06:00-14:00"), ac("14:00-22:00")]),
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-24": s([pref("14:00-22:00")]),
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: NA
    stationId: "4781", stationName: "FMHub T", cutOffTime: "23:59",
    driverId: "4059", driverName: "EDMILSON TAVARES DE SOUZA",
    phone: "62154321098", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": NA,
      "05-22": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: NA
    stationId: "6354", stationName: "FMHub F", cutOffTime: "20:00",
    driverId: "4058", driverName: "MARCOS JASIEL DA SILVA",
    phone: "62143210987", noShowCount: 0, isNewDriver: true,
    availability: {
      "05-21": NA,
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": NA,
      "05-24": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: single callup-confirmed
    stationId: "8127", stationName: "FMHub N", cutOffTime: "23:59",
    driverId: "4056", driverName: "JOSEMAR FELISCISMO CHAVIER",
    phone: "62132109876", noShowCount: 1, isNewDriver: false,
    availability: {
      "05-21": s([cc("06:00-14:00")]),
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    // Today: single decline callup
    stationId: "1593", stationName: "FMHub R", cutOffTime: "23:59",
    driverId: "4050", driverName: "DELCY ALVES DE BRITO",
    phone: "62121098765", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": s([cdec("06:00-14:00")]),
      "05-22": s([pref("06:00-14:00"), ac("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00")]),
      "05-24": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
];

const EXPRESS_DRIVERS: DriverRow[] = [
  {
    stationId: "5038", stationName: "FMHub D", cutOffTime: "22:00",
    driverId: "3001", driverName: "ANDRE SILVA COSTA",
    phone: "62111223344", noShowCount: 1, isNewDriver: false,
    availability: {
      "05-21": NA,
      "05-22": s([pref("06:00-14:00"), ac("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
  {
    stationId: "7264", stationName: "FMHub J", cutOffTime: "22:00",
    driverId: "3002", driverName: "MARIA FERNANDA OLIVEIRA",
    phone: "62155667788", noShowCount: 0, isNewDriver: true,
    availability: {
      "05-21": s([ign("06:00-14:00")]),
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00"), pref("14:00-22:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
];

const AGENCY_DRIVERS: DriverRow[] = [
  {
    stationId: "3907", stationName: "FMHub X", cutOffTime: "21:00",
    driverId: "2001", driverName: "ROBERTO CARLOS MENDES",
    phone: "62199887766", noShowCount: 0, isNewDriver: false,
    availability: {
      "05-21": s([cc("06:00-14:00"), cc("14:00-22:00")]),
      "05-22": s([ac("06:00-14:00"), pref("14:00-22:00")]),
      "05-23": s([pref("06:00-14:00")]),
      "05-24": NA,
      "05-25": PEN,
      "05-26": PEN,
      "05-27": PEN,
    },
  },
];

const TAB_DATA: Record<string, DriverRow[]> = {
  "Own Fleet driver": OWN_FLEET_DRIVERS,
  "Express": EXPRESS_DRIVERS,
  "Agency": AGENCY_DRIVERS,
};

// ── Small components ──────────────────────────────────────────────────────────
function InfoTooltip({ text }: { text: string }) {
  const [v, setV] = useState(false);
  return (
    <div className="relative inline-flex items-center ml-1">
      <button onMouseEnter={() => setV(true)} onMouseLeave={() => setV(false)}
        className="w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-[10px] font-bold hover:border-gray-600 hover:text-gray-600 leading-none">?</button>
      {v && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-56 bg-gray-800 text-white text-xs rounded px-2.5 py-2 shadow-lg z-50 leading-relaxed pointer-events-none whitespace-normal">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800" />
          {text}
        </div>
      )}
    </div>
  );
}

const SHIFT_CHIP: Record<ShiftStatus, string> = {
  preference:       "bg-amber-100 text-amber-800 border border-amber-400",
  "avail-confirmed":  "bg-emerald-100 text-emerald-700 border border-emerald-400",
  "callup-confirmed": "bg-emerald-600 text-white",
  "callup-declined":  "bg-rose-100 text-rose-700 border border-rose-400",
  ignored:            "bg-red-700 text-white",
};

function DayCell({ data }: { data: DayData }) {
  if (data.type === "not-available") return <span className="text-gray-400 text-xs">Not Available</span>;
  if (data.type === "pending")       return <span className="text-orange-500 text-xs font-medium">Pending Set Shift</span>;
  const sorted = [...data.shifts].sort((a, b) => a.time.localeCompare(b.time));
  return (
    <div className="flex flex-col gap-0.5">
      {sorted.map((sh, i) => (
        <span key={i} className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${SHIFT_CHIP[sh.status]}`}>
          {sh.time}
        </span>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 24;
const TABS = ["Own Fleet driver", "Express", "Agency"] as const;

export default function DriverAvailabilityPage() {
  const [activeTab, setActiveTab] = useState<string>("Own Fleet driver");

  const [filterDriverId,   setFilterDriverId]   = useState("");
  const [filterDriverName, setFilterDriverName] = useState("");
  const [filterStation,    setFilterStation]    = useState("");
  const [filterDateFrom,   setFilterDateFrom]   = useState("2026-05-21");
  const [filterDateTo,     setFilterDateTo]     = useState("2026-05-31");
  const [filterAvail,      setFilterAvail]      = useState("");

  const sourceRows = TAB_DATA[activeTab] ?? [];
  const [filtered, setFiltered] = useState<DriverRow[]>(sourceRows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage,    setGoToPage]    = useState("");
  const [visiblePhones, setVisiblePhones] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = () => {
    const rows = TAB_DATA[activeTab] ?? [];
    setFiltered(rows.filter((r) => {
      const idMatch   = !filterDriverId   || r.driverId.includes(filterDriverId);
      const nameMatch = !filterDriverName || r.driverName.toLowerCase().includes(filterDriverName.toLowerCase());
      const stMatch   = !filterStation    || r.stationName === filterStation;
      return idMatch && nameMatch && stMatch;
    }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterDriverId(""); setFilterDriverName(""); setFilterStation("");
    setFilterDateFrom("2026-05-21"); setFilterDateTo("2026-05-31"); setFilterAvail("");
    setFiltered(TAB_DATA[activeTab] ?? []);
    setCurrentPage(1);
  };

  const togglePhone = (id: string) =>
    setVisiblePhones((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const confirmedToday    = filtered.filter((r) => { const d = r.availability["05-21"]; return d?.type === "shifts"; }).length;
  const confirmedTomorrow = filtered.filter((r) => { const d = r.availability["05-22"]; return d?.type === "shifts"; }).length;

  const stationOptions = Array.from(new Set((TAB_DATA[activeTab] ?? []).map((r) => r.stationName)));

  return (
    <FMSLayout breadcrumbs={[{ label: "Driver Availability" }, { label: "Driver Availability" }]}>
      {/* Top tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setFiltered(TAB_DATA[tab] ?? []); setCurrentPage(1); }}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Driver ID</span>
            <input type="text" placeholder="Input" value={filterDriverId} onChange={(e) => setFilterDriverId(e.target.value)}
              className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 placeholder-gray-300 focus:outline-none focus:border-red-400 w-40" />
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Driver Name</span>
            <input type="text" placeholder="Input" value={filterDriverName} onChange={(e) => setFilterDriverName(e.target.value)}
              className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 placeholder-gray-300 focus:outline-none focus:border-red-400 w-52" />
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Station</span>
            <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)}
              className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 focus:outline-none focus:border-red-400 min-w-[180px]">
              <option value="">Select</option>
              {stationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        {/* Row 2 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Date</span>
            <input type="text" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
              className="border border-gray-300 px-2 py-1.5 text-gray-700 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 border-t border-b border-gray-300 text-gray-400">–</span>
            <input type="text" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
              className="border border-gray-300 px-2 py-1.5 text-gray-700 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap flex items-center gap-1">
              Driver Availability
              <InfoTooltip text="Filter drivers by their confirmed availability status for the selected date range." />
            </span>
            <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)}
              className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 focus:outline-none focus:border-red-400 min-w-[180px]">
              <option value="">Select</option>
              <option value="callup-confirmed">Call-up Confirmed</option>
              <option value="avail-confirmed">Availability Confirmed</option>
              <option value="preference">Preference Set</option>
              <option value="callup-declined">Decline Call-up</option>
              <option value="ignored">Ignored</option>
              <option value="pending">Pending Set Shift</option>
              <option value="not-available">Not Available</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
            <button onClick={handleReset}  className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2 mb-3">
        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded text-sm font-medium transition-colors">Batch Action</button>
        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-1.5 rounded text-sm font-medium transition-colors">Export</button>
      </div>

      {/* Summary + legend */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span>Availability confirmed for today: <strong className="text-gray-800">{confirmedToday}</strong></span>
          <span>Availability confirmed for tomorrow: <strong className="text-gray-800">{confirmedTomorrow}</strong></span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-400 inline-block" />
            Preference Set
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-400 inline-block" />
            Availability Confirmed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" />
            Call-up Confirmed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-400 inline-block" />
            Decline Call-up
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-700 inline-block" />
            Ignored
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200">
        <div className="overflow-x-auto">
          <table className="text-sm" style={{ minWidth: "max-content", width: "100%" }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap sticky left-0 bg-gray-50 z-10 min-w-[120px]">Station</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[100px]">Cut off time</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[200px]">Driver</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[130px]">Phone</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[110px]">
                  <div className="flex items-center">No-show count <InfoTooltip text="Number of times this driver did not show up for a confirmed shift." /></div>
                </th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap min-w-[100px]">
                  <div className="flex items-center">New Driver <InfoTooltip text="Indicates whether this driver joined within the last 30 days." /></div>
                </th>
                {DATES.map(({ key, day, isToday }) => (
                  <th key={key} className={`text-left px-3 py-3 font-medium whitespace-nowrap min-w-[130px] ${isToday ? "text-red-600 bg-red-50 border-t-2 border-t-red-500" : "text-gray-600"}`}>
                    {isToday && <div className="text-[10px] font-semibold uppercase tracking-wide text-red-500 mb-0.5">Today</div>}
                    {key} <span className={`font-normal ${isToday ? "text-red-400" : "text-gray-400"}`}>{day}</span>
                  </th>
                ))}
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={6 + DATES.length + 1} className="text-center py-12 text-gray-400">No data found</td></tr>
              ) : paged.map((row, i) => {
                const phoneKey = `${row.driverId}-${row.stationId}`;
                const showPhone = visiblePhones.has(phoneKey);
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 align-top">
                    <td className="px-3 py-3 text-gray-700 sticky left-0 bg-white hover:bg-gray-50 z-10">
                      <span className="font-medium">[{row.stationId}]</span>
                      <span className="text-gray-500 text-xs block truncate max-w-[110px]">{row.stationName}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{row.cutOffTime}</td>
                    <td className="px-3 py-3 text-gray-700">
                      <span className="font-medium text-gray-500">[{row.driverId}]</span>
                      <span className="ml-1 truncate max-w-[180px] inline-block align-bottom">{row.driverName}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs">{showPhone ? row.phone : "••••••••"}</span>
                        <button onClick={() => togglePhone(phoneKey)} className="text-gray-400 hover:text-gray-600">
                          {showPhone
                            ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          }
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700 text-center">{row.noShowCount}</td>
                    <td className="px-3 py-3 text-gray-700">{row.isNewDriver ? "Yes" : "No"}</td>
                    {DATES.map(({ key, isToday }) => (
                      <td key={key} className={`px-3 py-3 ${isToday ? "bg-red-50/50" : ""}`}>
                        <DayCell data={row.availability[key] ?? { type: "pending" }} />
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <button className="text-blue-600 hover:underline text-sm">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Total: {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-sm">{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${p === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-sm">{">"}</button>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-red-400 ml-1">
              <option>24 / Page</option><option>50 / Page</option>
            </select>
            <span className="text-sm text-gray-500">Go to page</span>
            <input type="number" min={1} max={totalPages} value={goToPage} onChange={(e) => setGoToPage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { const v = parseInt(goToPage); if (v >= 1 && v <= totalPages) setCurrentPage(v); }}}
              className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-red-400" />
            <button onClick={() => { const v = parseInt(goToPage); if (v >= 1 && v <= totalPages) setCurrentPage(v); }}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm">Go</button>
          </div>
        </div>
      </div>
    </FMSLayout>
  );
}
