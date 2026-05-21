"use client";
import { useState, useEffect, useRef } from "react";
import FMSLayout from "@/components/FMSLayout";

type DayOffset = "D-0" | "D-1";

interface ConfigRow {
  stationId: string;
  stationName: string;
  weeklyNotifTime: string;
  dailyNotifTime: string;
  dailyNotifDay?: DayOffset;
  dailyConfDeadline: string;
  dailyConfDay?: DayOffset;
  callupConfDeadline?: string;
  callupConfDay?: DayOffset;
  operator: string;
  minClusterQty: number;
}

const INIT_LM: ConfigRow[] = [
  { stationId: "5392", stationName: "LM Hub_SP_Leme UAT",           weeklyNotifTime: "Monday 15:51",   dailyNotifTime: "15:50", dailyConfDeadline: "23:59", operator: "andre.cruz@shopee.com",      minClusterQty: 1 },
  { stationId: "5053", stationName: "5038live",                      weeklyNotifTime: "Monday 09:00",   dailyNotifTime: "08:30", dailyConfDeadline: "23:00", operator: "andre.cruz@shopee.com",      minClusterQty: 3 },
  { stationId: "5044", stationName: "5009",                          weeklyNotifTime: "Monday 04:38",   dailyNotifTime: "04:49", dailyConfDeadline: "23:16", operator: "tingting.liutt@shopee.com",  minClusterQty: 3 },
  { stationId: "5034", stationName: "LM Hub_SP_São José dos Campos", weeklyNotifTime: "Tuesday 09:00",  dailyNotifTime: "10:00", dailyConfDeadline: "20:00", operator: "anderson.kohama@shopee.com", minClusterQty: 3 },
  { stationId: "5012", stationName: "Test Last Mile Hub E",          weeklyNotifTime: "Monday 06:45",   dailyNotifTime: "06:50", dailyConfDeadline: "23:42", operator: "tingting.liutt@shopee.com",  minClusterQty: 2 },
  { stationId: "5003", stationName: "Test LMHub B",                  weeklyNotifTime: "Tuesday 09:00",  dailyNotifTime: "10:00", dailyConfDeadline: "21:00", operator: "anderson.kohama@shopee.com", minClusterQty: 3 },
  { stationId: "5002", stationName: "Test LMHub A",                  weeklyNotifTime: "Monday 22:00",   dailyNotifTime: "11:30", dailyConfDeadline: "23:00", operator: "chao.yu@shopee.com",         minClusterQty: 3 },
  { stationId: "-",    stationName: "Express",                       weeklyNotifTime: "Monday 15:00",   dailyNotifTime: "11:00", dailyConfDeadline: "20:20", operator: "chao.yu@shopee.com",         minClusterQty: 5 },
];

const INIT_FM: ConfigRow[] = [
  { stationId: "FM001", stationName: "FMHub A", weeklyNotifTime: "Monday 08:00",    dailyNotifTime: "07:30", dailyNotifDay: "D-0", dailyConfDeadline: "23:00", dailyConfDay: "D-0", callupConfDeadline: "22:00", callupConfDay: "D-0", operator: "andre.cruz@shopee.com",      minClusterQty: 2 },
  { stationId: "FM002", stationName: "FMHub B", weeklyNotifTime: "Monday 09:00",    dailyNotifTime: "08:30", dailyNotifDay: "D-0", dailyConfDeadline: "22:00", dailyConfDay: "D-0", callupConfDeadline: "21:00", callupConfDay: "D-0", operator: "andre.cruz@shopee.com",      minClusterQty: 3 },
  { stationId: "FM003", stationName: "FMHub C", weeklyNotifTime: "Tuesday 07:00",   dailyNotifTime: "06:45", dailyNotifDay: "D-0", dailyConfDeadline: "23:30", dailyConfDay: "D-0", callupConfDeadline: "22:30", callupConfDay: "D-0", operator: "tingting.liutt@shopee.com",  minClusterQty: 2 },
  { stationId: "FM004", stationName: "FMHub D", weeklyNotifTime: "Monday 10:00",    dailyNotifTime: "09:30", dailyNotifDay: "D-0", dailyConfDeadline: "21:00", dailyConfDay: "D-0", callupConfDeadline: "20:00", callupConfDay: "D-0", operator: "tingting.liutt@shopee.com",  minClusterQty: 4 },
  { stationId: "FM005", stationName: "FMHub E", weeklyNotifTime: "Wednesday 08:30", dailyNotifTime: "08:00", dailyNotifDay: "D-0", dailyConfDeadline: "22:30", dailyConfDay: "D-0", callupConfDeadline: "21:30", callupConfDay: "D-0", operator: "anderson.kohama@shopee.com", minClusterQty: 3 },
  { stationId: "FM006", stationName: "FMHub F", weeklyNotifTime: "Monday 11:00",    dailyNotifTime: "10:30", dailyNotifDay: "D-0", dailyConfDeadline: "23:00", dailyConfDay: "D-0", callupConfDeadline: "22:00", callupConfDay: "D-0", operator: "anderson.kohama@shopee.com", minClusterQty: 2 },
  { stationId: "FM007", stationName: "FMHub G", weeklyNotifTime: "Tuesday 06:00",   dailyNotifTime: "05:45", dailyNotifDay: "D-0", dailyConfDeadline: "20:00", dailyConfDay: "D-0", callupConfDeadline: "19:00", callupConfDay: "D-0", operator: "chao.yu@shopee.com",         minClusterQty: 5 },
  { stationId: "FM008", stationName: "FMHub H", weeklyNotifTime: "Monday 14:00",    dailyNotifTime: "13:30", dailyNotifDay: "D-0", dailyConfDeadline: "23:59", dailyConfDay: "D-0", callupConfDeadline: "23:00", callupConfDay: "D-0", operator: "chao.yu@shopee.com",         minClusterQty: 3 },
];

const PAGE_SIZE = 20;
const DAYS  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINS  = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const ITEM_H = 32;

const trimSecs = (t: string) => t.replace(/(\d{2}:\d{2}):\d{2}/, "$1");
function parseWeekly(val: string) {
  const parts = val.split(" ");
  return { day: parts[0] ?? "", time: trimSecs(parts[1] ?? "") };
}
const withDay = (day: DayOffset | undefined, time: string) =>
  day ? `${day} ${time}` : time;

// ── Time Picker ───────────────────────────────────────────────────────────────
function TimePicker({ value, onChange, placeholder = "hh:mm" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minRef  = useRef<HTMLDivElement>(null);
  const [hh, mm] = value ? value.split(":") : ["", ""];

  useEffect(() => {
    if (!open) return;
    if (hourRef.current) hourRef.current.scrollTop = Math.max(0, (hh ? HOURS.indexOf(hh) : 0) * ITEM_H - 64);
    if (minRef.current)  minRef.current.scrollTop  = Math.max(0, (mm ? MINS.indexOf(mm)   : 0) * ITEM_H - 64);
  }, [open]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const pick = (type: "h" | "m", val: string) =>
    onChange(`${type === "h" ? val : (hh || "00")}:${type === "m" ? val : (mm || "00")}`);

  return (
    <div ref={wrapRef} className="relative flex-1">
      <div className="flex">
        <input readOnly value={value} placeholder={placeholder} onClick={() => setOpen((o) => !o)}
          className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-red-400 cursor-pointer min-w-0" />
        {value && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onChange(""); setOpen(false); }}
            className="border-t border-b border-gray-300 px-2 text-gray-400 hover:text-gray-600 text-base leading-none bg-white">×</button>
        )}
        <span onClick={() => setOpen((o) => !o)} className="px-2 py-2 border border-l-0 border-gray-300 rounded-r bg-white flex items-center cursor-pointer">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[60] flex overflow-hidden">
          <div ref={hourRef} className="h-48 overflow-y-auto w-14 border-r border-gray-100">
            {HOURS.map((h) => (
              <button key={h} type="button" onClick={() => pick("h", h)} style={{ height: ITEM_H }}
                className={`w-full text-center py-1.5 text-sm transition-colors ${hh === h ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>{h}</button>
            ))}
          </div>
          <div ref={minRef} className="h-48 overflow-y-auto w-14">
            {MINS.map((m) => (
              <button key={m} type="button" onClick={() => pick("m", m)} style={{ height: ITEM_H }}
                className={`w-full text-center py-1.5 text-sm transition-colors ${mm === m ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>{m}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DayOffsetTimePicker({ day, time, onDayChange, onTimeChange }: {
  day: DayOffset; time: string;
  onDayChange: (v: DayOffset) => void; onTimeChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <select value={day} onChange={(e) => onDayChange(e.target.value as DayOffset)}
        className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-400 w-20 flex-shrink-0">
        <option value="D-0">D-0</option>
        <option value="D-1">D-1</option>
      </select>
      <TimePicker value={time} onChange={onTimeChange} />
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-[520px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-600 mb-1"><span className="text-red-500 mr-0.5">*</span>{children}</p>;
}

function ColTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs font-bold hover:border-gray-600 hover:text-gray-600 flex-shrink-0 leading-none"
      >?</button>
      {visible && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-50 leading-relaxed pointer-events-none whitespace-normal">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800" />
          {text}
        </div>
      )}
    </div>
  );
}

function DayCell({ day, time }: { day?: DayOffset; time: string }) {
  if (!day) return <>{time}</>;
  const badge = day === "D-0"
    ? "bg-gray-100 text-gray-500 border border-gray-300"
    : "bg-amber-100 text-amber-700 border border-amber-300";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${badge}`}>{day}</span>
      <span>{time}</span>
    </span>
  );
}

const TOOLTIPS: Record<string, string> = {
  "Weekly Preference Collection Time": "Time when the system prompts drivers to submit their preferred working dates, shift times, and cluster for the following week.",
  "Availability Notification Time":    "Time when the system sends a prompt asking drivers to confirm whether they will be working on the current or next day.",
  "Availability Confirmation Deadline":"Deadline for drivers to submit their availability confirmation. Drivers who do not respond will be assumed unavailable.",
  "Call-up Confirmation Deadline":     "Deadline for drivers to accept or decline a call-up. Non-response is treated as a decline and the route is reassigned to another driver.",
};

// ── Form state shapes ─────────────────────────────────────────────────────────
const EMPTY_EDIT = {
  weeklyDay: "", weeklyTime: "",
  availNotifDay:  "D-0" as DayOffset, availNotifTime: "",
  availConfDay:   "D-0" as DayOffset, availConfDeadline: "",
  callupConfDay:  "D-0" as DayOffset, callupConfDeadline: "",
  minClusterQty: "",
};
const EMPTY_CREATE = { station: "", ...EMPTY_EDIT };

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DriverAvailabilityConfigPage() {
  const [activeTab, setActiveTab] = useState<"FM" | "LM">("FM");
  const isFM = activeTab === "FM";

  const [fmRows, setFmRows] = useState<ConfigRow[]>(INIT_FM);
  const [lmRows, setLmRows] = useState<ConfigRow[]>(INIT_LM);
  const sourceRows    = isFM ? fmRows : lmRows;
  const setSourceRows = isFM ? setFmRows : setLmRows;

  const [filterStation,     setFilterStation]     = useState("");
  const [filterWeeklyNotif, setFilterWeeklyNotif] = useState("");
  const [filterOperator,    setFilterOperator]    = useState("");
  const [filterMinQtyFrom,  setFilterMinQtyFrom]  = useState("");
  const [filterMinQtyTo,    setFilterMinQtyTo]    = useState("");
  const [filtered,          setFiltered]          = useState<ConfigRow[]>(sourceRows);
  const [currentPage,       setCurrentPage]       = useState(1);
  const [goToPage,          setGoToPage]          = useState("");

  const [viewTarget, setViewTarget] = useState<ConfigRow | null>(null);
  const [editTarget, setEditTarget] = useState<ConfigRow | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editForm,   setEditForm]   = useState(EMPTY_EDIT);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);

  useEffect(() => {
    const rows = isFM ? fmRows : lmRows;
    setFiltered(rows); setCurrentPage(1);
    setFilterStation(""); setFilterWeeklyNotif(""); setFilterOperator(""); setFilterMinQtyFrom(""); setFilterMinQtyTo("");
  }, [activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const colSpan = isFM ? 9 : 8;

  const applyFilter = (rows: ConfigRow[]) => rows.filter((r) => {
    const s = !filterStation     || r.stationName === filterStation;
    const w = !filterWeeklyNotif || r.weeklyNotifTime.toLowerCase().startsWith(filterWeeklyNotif.toLowerCase());
    const o = !filterOperator    || r.operator === filterOperator;
    const f = filterMinQtyFrom !== "" ? r.minClusterQty >= Number(filterMinQtyFrom) : true;
    const t = filterMinQtyTo   !== "" ? r.minClusterQty <= Number(filterMinQtyTo)   : true;
    return s && w && o && f && t;
  });

  const handleSearch = () => { setFiltered(applyFilter(sourceRows)); setCurrentPage(1); };
  const handleReset  = () => {
    setFilterStation(""); setFilterWeeklyNotif(""); setFilterOperator("");
    setFilterMinQtyFrom(""); setFilterMinQtyTo("");
    setFiltered(sourceRows); setCurrentPage(1);
  };

  const openEdit = (row: ConfigRow) => {
    const { day, time } = parseWeekly(row.weeklyNotifTime);
    setEditForm({
      weeklyDay: day, weeklyTime: time,
      availNotifDay:     row.dailyNotifDay    ?? "D-0", availNotifTime:     trimSecs(row.dailyNotifTime),
      availConfDay:      row.dailyConfDay     ?? "D-0", availConfDeadline:  trimSecs(row.dailyConfDeadline),
      callupConfDay:     row.callupConfDay    ?? "D-0", callupConfDeadline: row.callupConfDeadline ? trimSecs(row.callupConfDeadline) : "",
      minClusterQty: String(row.minClusterQty),
    });
    setEditTarget(row);
  };

  const handleEditSave = () => {
    if (!editTarget) return;
    const updated: ConfigRow = {
      ...editTarget,
      weeklyNotifTime:   `${editForm.weeklyDay} ${editForm.weeklyTime}`,
      dailyNotifTime:    editForm.availNotifTime,
      dailyNotifDay:     isFM ? editForm.availNotifDay    : undefined,
      dailyConfDeadline: editForm.availConfDeadline,
      dailyConfDay:      isFM ? editForm.availConfDay     : undefined,
      callupConfDeadline:isFM ? editForm.callupConfDeadline : undefined,
      callupConfDay:     isFM ? editForm.callupConfDay    : undefined,
      minClusterQty: Number(editForm.minClusterQty),
    };
    const newRows = sourceRows.map((r) => r.stationId === editTarget.stationId ? updated : r);
    setSourceRows(newRows);
    setFiltered((prev) => prev.map((r) => r.stationId === editTarget.stationId ? updated : r));
    setEditTarget(null);
  };

  const handleCreateSave = () => {
    const newId = isFM
      ? `FM${String(fmRows.length + 1).padStart(3, "0")}`
      : String(5000 + lmRows.length + 1);
    const newRow: ConfigRow = {
      stationId:         newId,
      stationName:       createForm.station,
      weeklyNotifTime:   `${createForm.weeklyDay} ${createForm.weeklyTime}`,
      dailyNotifTime:    createForm.availNotifTime,
      dailyNotifDay:     isFM ? createForm.availNotifDay    : undefined,
      dailyConfDeadline: createForm.availConfDeadline,
      dailyConfDay:      isFM ? createForm.availConfDay     : undefined,
      callupConfDeadline:isFM ? createForm.callupConfDeadline : undefined,
      callupConfDay:     isFM ? createForm.callupConfDay    : undefined,
      operator:          "",
      minClusterQty:     Number(createForm.minClusterQty),
    };
    const newRows = [...sourceRows, newRow];
    setSourceRows(newRows);
    setFiltered((prev) => [...prev, newRow]);
    setCreateForm(EMPTY_CREATE);
    setShowCreate(false);
  };

  const stationOptions  = sourceRows.map((r) => r.stationName);
  const operatorOptions = Array.from(new Set(sourceRows.map((r) => r.operator)));

  const ef = (key: keyof typeof EMPTY_EDIT,   v: string) => setEditForm((f)   => ({ ...f, [key]: v }));
  const cf = (key: keyof typeof EMPTY_CREATE, v: string) => setCreateForm((f) => ({ ...f, [key]: v }));

  const tableHeaders = isFM
    ? ["Station ID","Station Name","Weekly Preference Collection Time","Availability Notification Time","Availability Confirmation Deadline","Call-up Confirmation Deadline","Operator","Min Cluster Qty","Action"]
    : ["Station ID","Station Name","Weekly Preference Collection Time","Daily Notification Time","Daily Confirmation Deadline","Operator","Min Cluster Qty","Action"];

  return (
    <FMSLayout breadcrumbs={[{ label: "Workforce Management" }, { label: "Driver Availability Config" }]}>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {(["FM", "LM"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Station</span>
            <select value={filterStation} onChange={(e) => setFilterStation(e.target.value)} className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 focus:outline-none focus:border-red-400 min-w-[160px]">
              <option value="">Select</option>
              {stationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Weekly Preference Collection Time</span>
            <select value={filterWeeklyNotif} onChange={(e) => setFilterWeeklyNotif(e.target.value)} className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 focus:outline-none focus:border-red-400 min-w-[140px]">
              <option value="">Select</option>
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-stretch text-sm">
            <input type="text" placeholder="Start date" className="border border-gray-300 rounded-l px-2 py-1.5 text-gray-400 placeholder-gray-300 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 border-t border-b border-gray-300 text-gray-400">–</span>
            <input type="text" placeholder="End date" className="border border-gray-300 px-2 py-1.5 text-gray-400 placeholder-gray-300 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">
              {isFM ? "Availability Notification Time" : "Daily Notification Time"}
            </span>
            <input type="text" placeholder="Start date" className="border border-gray-300 px-2 py-1.5 text-gray-400 placeholder-gray-300 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 border-t border-b border-gray-300 text-gray-400">–</span>
            <input type="text" placeholder="End date" className="border border-gray-300 px-2 py-1.5 text-gray-400 placeholder-gray-300 focus:outline-none focus:border-red-400 w-28" />
            <span className="px-2 py-1.5 bg-gray-50 border border-l-0 border-gray-300 rounded-r text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Operator</span>
            <select value={filterOperator} onChange={(e) => setFilterOperator(e.target.value)} className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 focus:outline-none focus:border-red-400 min-w-[200px]">
              <option value="">Select</option>
              {operatorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-stretch text-sm">
            <span className="px-3 py-1.5 bg-gray-50 border border-gray-300 border-r-0 rounded-l text-gray-700 whitespace-nowrap">Min Cluster Qty</span>
            <input type="number" placeholder="Input" value={filterMinQtyFrom} onChange={(e) => setFilterMinQtyFrom(e.target.value)} className="border border-gray-300 px-2 py-1.5 text-gray-500 placeholder-gray-300 focus:outline-none focus:border-red-400 w-20" />
            <span className="px-2 py-1.5 border-t border-b border-gray-300 text-gray-400">–</span>
            <input type="number" placeholder="Input" value={filterMinQtyTo} onChange={(e) => setFilterMinQtyTo(e.target.value)} className="border border-gray-300 rounded-r px-2 py-1.5 text-gray-500 placeholder-gray-300 focus:outline-none focus:border-red-400 w-20" />
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
            <button onClick={handleReset}  className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <button onClick={() => setShowCreate(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">Create</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {tableHeaders.map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-gray-600 whitespace-nowrap">
                    <div className="flex items-center">
                      {h}
                      {TOOLTIPS[h] && <ColTooltip text={TOOLTIPS[h]} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={colSpan} className="text-center py-12 text-gray-400">No data found</td></tr>
              ) : paged.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{row.stationId}</td>
                  <td className="px-4 py-3 text-gray-700">{row.stationName}</td>
                  <td className="px-4 py-3 text-gray-700">{trimSecs(row.weeklyNotifTime)}</td>
                  <td className="px-4 py-3 text-gray-700">{isFM ? <DayCell day={row.dailyNotifDay} time={trimSecs(row.dailyNotifTime)} /> : trimSecs(row.dailyNotifTime)}</td>
                  <td className="px-4 py-3 text-gray-700">{isFM ? <DayCell day={row.dailyConfDay}  time={trimSecs(row.dailyConfDeadline)} /> : trimSecs(row.dailyConfDeadline)}</td>
                  {isFM && <td className="px-4 py-3 text-gray-700">{row.callupConfDeadline ? trimSecs(row.callupConfDeadline) : "—"}</td>}
                  <td className="px-4 py-3 text-gray-700">{row.operator}</td>
                  <td className="px-4 py-3 text-gray-700">{row.minClusterQty}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => setViewTarget(row)} className="text-blue-600 hover:underline text-sm">View</button>
                      <button onClick={() => openEdit(row)}      className="text-blue-600 hover:underline text-sm">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Total: {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-sm">{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${p === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-sm">{">"}</button>
            <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-red-400 ml-1">
              <option>20 / Page</option><option>50 / Page</option>
            </select>
            <span className="text-sm text-gray-500">Go to page</span>
            <input type="number" min={1} max={totalPages} value={goToPage} onChange={(e) => setGoToPage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { const v = parseInt(goToPage); if (v >= 1 && v <= totalPages) setCurrentPage(v); }}} className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-red-400" />
            <button onClick={() => { const v = parseInt(goToPage); if (v >= 1 && v <= totalPages) setCurrentPage(v); }} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm">Go</button>
          </div>
        </div>
      </div>

      {/* View modal */}
      {viewTarget && (
        <ModalShell title="View" onClose={() => setViewTarget(null)}>
          <div className="px-5 py-4 space-y-4">
            <div><p className="text-xs text-gray-400 mb-0.5">Station</p><p className="text-sm text-gray-800">{viewTarget.stationName}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">Weekly Preference Collection Time</p><p className="text-sm text-gray-800">{trimSecs(viewTarget.weeklyNotifTime)}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">{isFM ? "Availability Notification Time" : "Daily Notification Time"}</p>
              <p className="text-sm text-gray-800">{isFM ? <DayCell day={viewTarget.dailyNotifDay} time={trimSecs(viewTarget.dailyNotifTime)} /> : trimSecs(viewTarget.dailyNotifTime)}</p></div>
            <div><p className="text-xs text-gray-400 mb-0.5">{isFM ? "Availability Confirmation Deadline" : "Daily Confirmation Deadline"}</p>
              <p className="text-sm text-gray-800">{isFM ? <DayCell day={viewTarget.dailyConfDay} time={trimSecs(viewTarget.dailyConfDeadline)} /> : trimSecs(viewTarget.dailyConfDeadline)}</p></div>
            {isFM && <div><p className="text-xs text-gray-400 mb-0.5">Call-up Confirmation Deadline</p>
              <p className="text-sm text-gray-800">{viewTarget.callupConfDeadline ? trimSecs(viewTarget.callupConfDeadline) : "—"}</p></div>}
            <div><p className="text-xs text-gray-400 mb-0.5">Min Cluster Qty</p><p className="text-sm text-gray-800">{viewTarget.minClusterQty}</p></div>
          </div>
          <div className="flex justify-end px-5 py-4 border-t border-gray-200">
            <button onClick={() => setViewTarget(null)} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Confirm</button>
          </div>
        </ModalShell>
      )}

      {/* Edit modal */}
      {editTarget && (
        <ModalShell title="Edit" onClose={() => setEditTarget(null)}>
          <div className="px-5 py-4 space-y-4">
            <div>
              <RequiredLabel>Station</RequiredLabel>
              <select disabled className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-400 bg-gray-50 focus:outline-none">
                <option>{editTarget.stationName}</option>
              </select>
            </div>
            <div>
              <RequiredLabel>Weekly Preference Collection Time</RequiredLabel>
              <div className="flex gap-2">
                <select value={editForm.weeklyDay} onChange={(e) => ef("weeklyDay", e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-400 flex-1">
                  {DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <TimePicker value={editForm.weeklyTime} onChange={(v) => ef("weeklyTime", v)} />
              </div>
            </div>
            <div>
              <RequiredLabel>{isFM ? "Availability Notification Time" : "Daily Notification Time"}</RequiredLabel>
              {isFM
                ? <DayOffsetTimePicker day={editForm.availNotifDay} time={editForm.availNotifTime} onDayChange={(v) => ef("availNotifDay", v)} onTimeChange={(v) => ef("availNotifTime", v)} />
                : <TimePicker value={editForm.availNotifTime} onChange={(v) => ef("availNotifTime", v)} />}
            </div>
            <div>
              <RequiredLabel>{isFM ? "Availability Confirmation Deadline" : "Daily Confirmation Deadline"}</RequiredLabel>
              {isFM
                ? <DayOffsetTimePicker day={editForm.availConfDay} time={editForm.availConfDeadline} onDayChange={(v) => ef("availConfDay", v)} onTimeChange={(v) => ef("availConfDeadline", v)} />
                : <TimePicker value={editForm.availConfDeadline} onChange={(v) => ef("availConfDeadline", v)} />}
            </div>
            {isFM && (
              <div>
                <RequiredLabel>Call-up Confirmation Deadline</RequiredLabel>
                <TimePicker value={editForm.callupConfDeadline} onChange={(v) => ef("callupConfDeadline", v)} />
              </div>
            )}
            <div>
              <RequiredLabel>Min Cluster Qty</RequiredLabel>
              <input type="number" value={editForm.minClusterQty} onChange={(e) => ef("minClusterQty", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
            <button onClick={() => setEditTarget(null)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-1.5 rounded text-sm transition-colors">Cancel</button>
            <button onClick={handleEditSave} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Confirm</button>
          </div>
        </ModalShell>
      )}

      {/* Create modal */}
      {showCreate && (
        <ModalShell title="Create" onClose={() => setShowCreate(false)}>
          <div className="px-5 py-4 space-y-4">
            <div>
              <RequiredLabel>Station</RequiredLabel>
              <select value={createForm.station} onChange={(e) => cf("station", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-red-400">
                <option value="">Select</option>
                {stationOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <RequiredLabel>Weekly Preference Collection Time</RequiredLabel>
              <div className="flex gap-2">
                <select value={createForm.weeklyDay} onChange={(e) => cf("weeklyDay", e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 focus:outline-none focus:border-red-400 flex-1">
                  <option value="">Select</option>
                  {DAYS.map((d) => <option key={d}>{d}</option>)}
                </select>
                <TimePicker value={createForm.weeklyTime} onChange={(v) => cf("weeklyTime", v)} />
              </div>
            </div>
            <div>
              <RequiredLabel>{isFM ? "Availability Notification Time" : "Daily Notification Time"}</RequiredLabel>
              {isFM
                ? <DayOffsetTimePicker day={createForm.availNotifDay} time={createForm.availNotifTime} onDayChange={(v) => cf("availNotifDay", v)} onTimeChange={(v) => cf("availNotifTime", v)} />
                : <TimePicker value={createForm.availNotifTime} onChange={(v) => cf("availNotifTime", v)} />}
            </div>
            <div>
              <RequiredLabel>{isFM ? "Availability Confirmation Deadline" : "Daily Confirmation Deadline"}</RequiredLabel>
              {isFM
                ? <DayOffsetTimePicker day={createForm.availConfDay} time={createForm.availConfDeadline} onDayChange={(v) => cf("availConfDay", v)} onTimeChange={(v) => cf("availConfDeadline", v)} />
                : <TimePicker value={createForm.availConfDeadline} onChange={(v) => cf("availConfDeadline", v)} />}
            </div>
            {isFM && (
              <div>
                <RequiredLabel>Call-up Confirmation Deadline</RequiredLabel>
                <TimePicker value={createForm.callupConfDeadline} onChange={(v) => cf("callupConfDeadline", v)} />
              </div>
            )}
            <div>
              <RequiredLabel>Min Cluster Qty</RequiredLabel>
              <input type="number" placeholder="Input" value={createForm.minClusterQty} onChange={(e) => cf("minClusterQty", e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 placeholder-gray-300 focus:outline-none focus:border-red-400" />
            </div>
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
            <button onClick={() => setShowCreate(false)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-1.5 rounded text-sm transition-colors">Cancel</button>
            <button onClick={handleCreateSave} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Confirm</button>
          </div>
        </ModalShell>
      )}
    </FMSLayout>
  );
}
