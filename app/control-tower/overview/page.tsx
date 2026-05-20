"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import FMSLayout from "@/components/FMSLayout";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";

// ── Types ─────────────────────────────────────────────────────────
type Region = "All" | "North" | "South" | "Central" | "West" | "East";
const REGIONS: Region[] = ["All", "North", "South", "Central", "West", "East"];

// ── Station data ──────────────────────────────────────────────────
interface Station {
  id: string;
  name: string;
  region: Exclude<Region, "All">;
  total: number;
  closed: number;
  art: string;
  sla: string;
  breaching: number;
}

const ALL_STATIONS: Station[] = [
  { id: "SCN-001", name: "Penjaringan First Mile Hub",   region: "North",   total: 28, closed: 22, art: "3.8 hrs", sla: "94%", breaching: 1 },
  { id: "SCN-002", name: "Tanjung Priok First Mile Hub", region: "North",   total: 35, closed: 25, art: "5.2 hrs", sla: "91%", breaching: 3 },
  { id: "SCN-003", name: "Cilincing First Mile Hub",     region: "North",   total: 19, closed: 12, art: "4.5 hrs", sla: "89%", breaching: 2 },
  { id: "SCN-004", name: "Kemayoran First Mile Hub",     region: "North",   total: 24, closed: 20, art: "3.1 hrs", sla: "96%", breaching: 0 },
  { id: "SCS-001", name: "Jagakarsa First Mile Hub",     region: "South",   total: 31, closed: 27, art: "2.9 hrs", sla: "97%", breaching: 0 },
  { id: "SCS-002", name: "Kebayoran First Mile Hub",     region: "South",   total: 22, closed: 18, art: "3.5 hrs", sla: "95%", breaching: 1 },
  { id: "SCS-003", name: "Pasar Minggu First Mile Hub",  region: "South",   total: 26, closed: 21, art: "4.1 hrs", sla: "92%", breaching: 2 },
  { id: "SCS-004", name: "Tebet First Mile Hub",         region: "South",   total: 18, closed:  3, art: "8.2 hrs", sla: "72%", breaching: 5 },
  { id: "SCC-001", name: "Gambir First Mile Hub",        region: "Central", total: 42, closed: 30, art: "5.8 hrs", sla: "88%", breaching: 4 },
  { id: "SCC-002", name: "Tanah Abang First Mile Hub",   region: "Central", total: 38, closed: 28, art: "6.1 hrs", sla: "85%", breaching: 3 },
  { id: "SCC-003", name: "Cempaka Putih First Mile Hub", region: "Central", total: 29, closed: 24, art: "3.3 hrs", sla: "95%", breaching: 1 },
  { id: "SCW-001", name: "Grogol First Mile Hub",        region: "West",    total: 33, closed: 29, art: "2.7 hrs", sla: "98%", breaching: 0 },
  { id: "SCW-002", name: "Tambora First Mile Hub",       region: "West",    total: 27, closed: 20, art: "4.8 hrs", sla: "90%", breaching: 2 },
  { id: "SCW-003", name: "Kembangan First Mile Hub",     region: "West",    total: 21, closed: 17, art: "3.9 hrs", sla: "93%", breaching: 1 },
  { id: "SCE-001", name: "Cakung First Mile Hub",        region: "East",    total: 36, closed: 26, art: "5.5 hrs", sla: "87%", breaching: 3 },
  { id: "SCE-002", name: "Pulo Gadung First Mile Hub",   region: "East",    total: 25, closed: 19, art: "4.4 hrs", sla: "91%", breaching: 2 },
  { id: "SCE-003", name: "Duren Sawit First Mile Hub",   region: "East",    total: 30, closed: 24, art: "4.2 hrs", sla: "92%", breaching: 2 },
];

// ── Chart data per region ─────────────────────────────────────────
const LINE_LABELS = ["Nov 25", "Nov 28", "Dec 1", "Dec 4", "Dec 7", "Dec 10", "Dec 13", "Dec 16", "Dec 19", "Dec 22", "Dec 26", "Dec 30"];

const scale = (arr: number[], f: number) => arr.map(v => Math.max(1, Math.round(v * f)));
const BASE_P1 = [4, 6, 3, 8, 5, 7, 4, 9, 6, 5, 7, 4];
const BASE_P2 = [9, 12, 8, 15, 11, 13, 10, 17, 12, 11, 14, 9];
const BASE_P3 = [18, 22, 15, 28, 20, 24, 18, 30, 22, 20, 25, 17];

const LINE_BY_REGION: Record<Region, { p1: number[]; p2: number[]; p3: number[] }> = {
  All:     { p1: BASE_P1, p2: BASE_P2, p3: BASE_P3 },
  North:   { p1: scale(BASE_P1, 0.6), p2: scale(BASE_P2, 0.7), p3: scale(BASE_P3, 0.8) },
  South:   { p1: scale(BASE_P1, 0.8), p2: scale(BASE_P2, 0.9), p3: scale(BASE_P3, 0.7) },
  Central: { p1: scale(BASE_P1, 1.3), p2: scale(BASE_P2, 1.1), p3: scale(BASE_P3, 1.4) },
  West:    { p1: scale(BASE_P1, 0.5), p2: scale(BASE_P2, 0.6), p3: scale(BASE_P3, 0.7) },
  East:    { p1: scale(BASE_P1, 0.9), p2: scale(BASE_P2, 0.85), p3: scale(BASE_P3, 1.0) },
};

// ── Per-region KPI values ─────────────────────────────────────────
const KPI_BY_REGION: Record<Region, { art: string; sla: string; breaching: number; p1Ratio: number; p2Ratio: number }> = {
  All:     { art: "4.2 hrs", sla: "95%", breaching: 12, p1Ratio: 0.14, p2Ratio: 0.26 },
  North:   { art: "3.9 hrs", sla: "93%", breaching:  6, p1Ratio: 0.12, p2Ratio: 0.24 },
  South:   { art: "5.1 hrs", sla: "91%", breaching:  8, p1Ratio: 0.18, p2Ratio: 0.28 },
  Central: { art: "6.2 hrs", sla: "87%", breaching:  7, p1Ratio: 0.20, p2Ratio: 0.30 },
  West:    { art: "3.2 hrs", sla: "97%", breaching:  3, p1Ratio: 0.10, p2Ratio: 0.22 },
  East:    { art: "4.8 hrs", sla: "90%", breaching:  7, p1Ratio: 0.16, p2Ratio: 0.28 },
};

type DonutSlice = { label: string; pct: number; color: string };
const DONUT_BY_REGION: Record<Region, DonutSlice[]> = {
  All:     [{ label: "Miss-Assignment [P1]",          pct: 45, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 35, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 20, color: "#f97316" }],
  North:   [{ label: "Miss-Assignment [P1]",          pct: 50, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 30, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 20, color: "#f97316" }],
  South:   [{ label: "Miss-Assignment [P1]",          pct: 40, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 38, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 22, color: "#f97316" }],
  Central: [{ label: "Miss-Assignment [P1]",          pct: 42, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 35, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 23, color: "#f97316" }],
  West:    [{ label: "Miss-Assignment [P1]",          pct: 48, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 32, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 20, color: "#f97316" }],
  East:    [{ label: "Miss-Assignment [P1]",          pct: 44, color: "#ef4444" }, { label: "No Movement from driver [P1]", pct: 36, color: "#3b82f6" }, { label: "Dispatch Backup Driver [P2]",   pct: 20, color: "#f97316" }],
};

// ── SVG Line Chart with hover tooltip ────────────────────────────
function LineChart({ data }: { data: { p1: number[]; p2: number[]; p3: number[] } }) {
  const W = 520, H = 200;
  const PAD = { top: 16, right: 16, bottom: 36, left: 32 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;
  const n = LINE_LABELS.length;
  const maxVal = Math.max(...data.p1, ...data.p2, ...data.p3);
  const gridMax = Math.ceil(maxVal / 5) * 5;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });

  const xp = (i: number) => PAD.left + (i / (n - 1)) * cW;
  const yp = (v: number) => PAD.top + cH - (v / gridMax) * cH;

  const polyline = (series: number[], color: string) => (
    <polyline points={series.map((v, i) => `${xp(i)},${yp(v)}`).join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
  );
  const dots = (series: number[], color: string, hColor: string) =>
    series.map((v, i) => (
      <circle key={i} cx={xp(i)} cy={yp(v)} r={hoveredIdx === i ? 5 : 3}
        fill={hoveredIdx === i ? hColor : color} stroke="white" strokeWidth={hoveredIdx === i ? 2 : 1.5} />
    ));

  const gridVals = Array.from({ length: 6 }, (_, i) => Math.round((gridMax / 5) * i));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((svgX - PAD.left) / cW) * (n - 1));
    setHoveredIdx(Math.max(0, Math.min(n - 1, idx)));
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200, display: "block" }}
        onMouseMove={handleMouseMove} onMouseLeave={() => setHoveredIdx(null)}>
        {gridVals.map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yp(v)} x2={W - PAD.right} y2={yp(v)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 4} y={yp(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#9ca3af">{v}</text>
          </g>
        ))}
        <line x1={PAD.left} y1={yp(0)} x2={W - PAD.right} y2={yp(0)} stroke="#e5e7eb" strokeWidth="1" />
        {/* Hover crosshair */}
        {hoveredIdx !== null && (
          <line x1={xp(hoveredIdx)} y1={PAD.top} x2={xp(hoveredIdx)} y2={PAD.top + cH}
            stroke="#d1d5db" strokeWidth="1" strokeDasharray="3,2" />
        )}
        {polyline(data.p3, "#9ca3af")}
        {polyline(data.p2, "#f97316")}
        {polyline(data.p1, "#ef4444")}
        {dots(data.p3, "#9ca3af", "#9ca3af")}
        {dots(data.p2, "#f97316", "#ea580c")}
        {dots(data.p1, "#ef4444", "#dc2626")}
        {LINE_LABELS.map((lbl, i) =>
          i % 2 === 0 ? <text key={i} x={xp(i)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9" fill="#9ca3af">{lbl}</text> : null
        )}
      </svg>

      {/* Hover tooltip */}
      {hoveredIdx !== null && (
        <div className="fixed z-50 pointer-events-none bg-white rounded-lg shadow-xl border border-gray-200 px-3 py-2.5 text-xs min-w-[140px]"
          style={{ left: mousePos.x + 14, top: mousePos.y - 80 }}>
          <p className="text-gray-500 font-medium mb-2">{LINE_LABELS[hoveredIdx]}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span className="text-gray-600 flex-1">P1</span>
              <span className="font-semibold text-gray-900">{data.p1[hoveredIdx]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
              <span className="text-gray-600 flex-1">P2</span>
              <span className="font-semibold text-gray-900">{data.p2[hoveredIdx]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
              <span className="text-gray-600 flex-1">P3</span>
              <span className="font-semibold text-gray-900">{data.p3[hoveredIdx]}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SVG Donut Chart ───────────────────────────────────────────────
function DonutChart({ data }: { data: DonutSlice[] }) {
  const cx = 80, cy = 80, r = 62, ir = 38;
  let angle = -Math.PI / 2;

  const segments = data.map(d => {
    const sweep = (d.pct / 100) * 2 * Math.PI;
    const sa = angle, ea = angle + sweep;
    angle = ea;
    const largeArc = sweep > Math.PI ? 1 : 0;
    const { cos, sin } = Math;
    const path = [`M ${cx + r * cos(sa)} ${cy + r * sin(sa)}`, `A ${r} ${r} 0 ${largeArc} 1 ${cx + r * cos(ea)} ${cy + r * sin(ea)}`, `L ${cx + ir * cos(ea)} ${cy + ir * sin(ea)}`, `A ${ir} ${ir} 0 ${largeArc} 0 ${cx + ir * cos(sa)} ${cy + ir * sin(sa)}`, "Z"].join(" ");
    return { ...d, path };
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 160 160" style={{ width: 150, height: 150 }}>
        {segments.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth="1.5" />)}
      </svg>
      <div className="w-full grid grid-cols-2 gap-x-3 gap-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-600 truncate flex-1">{d.label}</span>
            <span className="text-xs font-semibold text-gray-800 flex-shrink-0">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function KpiTooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative group inline-flex flex-shrink-0">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 cursor-help leading-none" style={{ fontSize: "9px" }}>?</span>
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-gray-800 text-white text-xs rounded px-2.5 py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 leading-snug pointer-events-none whitespace-normal">
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
        {children}
      </span>
    </span>
  );
}

function ConfigRow({ label, value, suffix, onChange }: { label: React.ReactNode; value: number; suffix: string; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-600 flex items-center gap-1">{label}</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <input type="number" value={value}
          onChange={e => onChange(Number(e.target.value))}
          onKeyDown={e => { if (e.key === "ArrowUp") { e.preventDefault(); onChange(value + 1); } if (e.key === "ArrowDown") { e.preventDefault(); onChange(value - 1); } }}
          className="w-14 border border-gray-300 rounded px-2 py-1 text-xs text-gray-800 text-right focus:outline-none focus:border-blue-400" />
        {suffix && <span className="text-xs text-gray-500 w-5">{suffix}</span>}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function CTOverviewPage() {
  const [activeTab, setActiveTab] = useState<"fm" | "lm">("fm");
  const [region, setRegion] = useState<Region>("All");

  // Banner state (editable for demo)
  const [bannerTotal, setBannerTotal]   = useState(156);
  const [bannerClosed, setBannerClosed] = useState(98);
  const [bannerP1, setBannerP1]         = useState(8);
  const [bannerP2, setBannerP2]         = useState(15);

  // Configurable thresholds & KPI targets
  const [healthyThreshold, setHealthyThreshold]   = useState(80);
  const [criticalThreshold, setCriticalThreshold] = useState(20);
  const [kpiArtTarget, setKpiArtTarget]           = useState(2);
  const [kpiSlaTarget, setKpiSlaTarget]           = useState(98);
  const [kpiBreachTarget, setKpiBreachTarget]     = useState(0);
  const [showConfig, setShowConfig]               = useState(false);
  const configRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (configRef.current && !configRef.current.contains(e.target as Node)) setShowConfig(false); };
    if (showConfig) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showConfig]);

  const bannerOpen  = Math.max(0, bannerTotal - bannerClosed);
  const bannerP3    = Math.max(0, bannerOpen - bannerP1 - bannerP2);
  const closedPct   = bannerTotal > 0 ? (bannerClosed / bannerTotal) * 100 : 0;
  const health      = closedPct >= healthyThreshold ? "Healthy" : closedPct >= criticalThreshold ? "Moderate" : "Critical";
  const healthColor = health === "Healthy" ? "text-green-600" : health === "Moderate" ? "text-yellow-600" : "text-red-600";
  const bannerBg    = health === "Healthy" ? "bg-green-50 border-green-200" : health === "Moderate" ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  // Sync banner metrics when region changes
  useEffect(() => {
    const stations = region === "All" ? ALL_STATIONS : ALL_STATIONS.filter(s => s.region === region);
    const total  = stations.reduce((s, st) => s + st.total,  0);
    const closed = stations.reduce((s, st) => s + st.closed, 0);
    const open   = total - closed;
    const kpi    = KPI_BY_REGION[region];
    setBannerTotal(total);
    setBannerClosed(closed);
    setBannerP1(Math.round(open * kpi.p1Ratio));
    setBannerP2(Math.round(open * kpi.p2Ratio));
  }, [region]);

  // Table sort state
  type SortCol = "total" | "closed" | "open" | "health" | "art" | "sla" | "breaching";
  const [sortCol, setSortCol] = useState<SortCol | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  };
  const sortIcon = (col: SortCol) => {
    if (sortCol !== col) return <span className="text-gray-300 ml-0.5">↕</span>;
    return <span className="text-blue-500 ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  // Region-filtered data
  const lineData   = LINE_BY_REGION[region];
  const donutData  = DONUT_BY_REGION[region];
  const tableRows  = region === "All" ? ALL_STATIONS : ALL_STATIONS.filter(s => s.region === region);

  const stationHealth = (s: Station) => {
    const pct = s.total > 0 ? (s.closed / s.total) * 100 : 0;
    return pct >= healthyThreshold ? "Healthy" : pct >= criticalThreshold ? "Moderate" : "Critical";
  };

  const sortedRows = useMemo(() => {
    if (!sortCol) return tableRows;
    const healthNum = (s: Station) => { const pct = s.total > 0 ? (s.closed / s.total) * 100 : 0; return pct >= healthyThreshold ? 2 : pct >= criticalThreshold ? 1 : 0; };
    return [...tableRows].sort((a, b) => {
      let av = 0, bv = 0;
      if (sortCol === "total")     { av = a.total;            bv = b.total; }
      if (sortCol === "closed")    { av = a.closed;           bv = b.closed; }
      if (sortCol === "open")      { av = a.total - a.closed; bv = b.total - b.closed; }
      if (sortCol === "health")    { av = healthNum(a);       bv = healthNum(b); }
      if (sortCol === "art")       { av = parseFloat(a.art);  bv = parseFloat(b.art); }
      if (sortCol === "sla")       { av = parseFloat(a.sla);  bv = parseFloat(b.sla); }
      if (sortCol === "breaching") { av = a.breaching;        bv = b.breaching; }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [tableRows, sortCol, sortDir, healthyThreshold, criticalThreshold]);
  const healthChip = (h: string) => {
    if (h === "Healthy")  return "bg-green-100 text-green-700";
    if (h === "Moderate") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <FMSLayout breadcrumbs={[{ label: "Dashboard" }, { label: "Control Tower" }]}>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {(["fm", "lm"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-semibold uppercase tracking-wide border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "lm" && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">LM module — coming soon</div>
      )}

      {activeTab === "fm" && (
        <div className="space-y-4">

          {/* ── Health Banner ── */}
          <div className={`rounded border px-6 py-4 ${bannerBg}`}>

            {/* Banner top row: label + region filter + config */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Market Level</span>
              <div className="flex items-center gap-3">
                {/* Region filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Region</span>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value as Region)}
                    className="border border-gray-300 rounded px-2.5 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:border-blue-400 cursor-pointer"
                  >
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {/* Config gear */}
                <div ref={configRef} className="relative">
                  <button onClick={() => setShowConfig(v => !v)} title="Configure thresholds & targets"
                    className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${showConfig ? "bg-gray-200 text-gray-700" : "text-gray-400 hover:text-gray-600 hover:bg-white/60"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  {showConfig && (
                    <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 space-y-4">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Banner Configuration</p>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> Health Thresholds (% closed)
                        </p>
                        <div className="space-y-2">
                          <ConfigRow label={<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Healthy if ≥</span>} value={healthyThreshold} suffix="%" onChange={v => setHealthyThreshold(Math.max(criticalThreshold + 1, Math.min(100, v)))} />
                          <ConfigRow label={<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Critical if &lt;</span>} value={criticalThreshold} suffix="%" onChange={v => setCriticalThreshold(Math.max(0, Math.min(healthyThreshold - 1, v)))} />
                        </div>
                        <p className="text-xs text-gray-400 mt-1.5">Moderate = between Critical and Healthy thresholds</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> KPI Targets
                        </p>
                        <div className="space-y-2">
                          <ConfigRow label="Avg. Resolution Time" value={kpiArtTarget} suffix="hrs" onChange={v => setKpiArtTarget(Math.max(0, v))} />
                          <ConfigRow label="SLA Adherence" value={kpiSlaTarget} suffix="%" onChange={v => setKpiSlaTarget(Math.min(100, Math.max(0, v)))} />
                          <ConfigRow label="Tickets Breaching SLA" value={kpiBreachTarget} suffix="" onChange={v => setKpiBreachTarget(Math.max(0, v))} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Banner metrics row */}
            <div className="flex items-center gap-8">
              {/* Overall Health */}
              <div className="flex-shrink-0 min-w-[160px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-semibold text-gray-700">Overall Health</span>
                  <KpiTooltip>
                    <p className="font-semibold mb-1.5">Health is based on % of tickets closed:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block flex-shrink-0" /><span>Healthy: ≥{healthyThreshold}% closed</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block flex-shrink-0" /><span>Moderate: {criticalThreshold}%–{healthyThreshold - 1}% closed</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block flex-shrink-0" /><span>Critical: &lt;{criticalThreshold}% closed</span></div>
                    </div>
                  </KpiTooltip>
                </div>
                <span className={`text-3xl font-bold ${healthColor}`}>{health}</span>
              </div>
              <div className="w-px self-stretch bg-gray-300 flex-shrink-0" />
              {/* Current Ticket Status */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Current Ticket Status</span>
                  <KpiTooltip>
                    <p className="font-semibold mb-1.5">Ticket counting rules:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block flex-shrink-0" /><span><b>Closed</b>: Resolved or Cancelled</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block flex-shrink-0" /><span><b>Open</b>: Created</span></div>
                    </div>
                  </KpiTooltip>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Total Ticket</div>
                    <input type="number" min={0} value={bannerTotal} onChange={e => { const v = Math.max(0, Number(e.target.value)); setBannerTotal(v); if (bannerClosed > v) { setBannerClosed(v); setBannerP1(0); setBannerP2(0); } }} className="text-2xl font-bold bg-transparent outline-none w-16 text-gray-900" style={{ appearance: "textfield" }} />
                  </div>
                  <div className="w-px h-10 bg-gray-300 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Closed</div>
                    <input type="number" min={0} value={bannerClosed} onChange={e => { const v = Math.min(bannerTotal, Math.max(0, Number(e.target.value))); setBannerClosed(v); const o = Math.max(0, bannerTotal - v); if (bannerP1 + bannerP2 > o) { setBannerP1(0); setBannerP2(0); } }} className="text-2xl font-bold bg-transparent outline-none w-16 text-gray-900" style={{ appearance: "textfield" }} />
                  </div>
                  <div className="w-px h-10 bg-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Open</div>
                      <span className="text-2xl font-bold text-gray-900">{bannerOpen}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />P1: <input type="number" min={0} value={bannerP1} onChange={e => setBannerP1(Math.min(bannerOpen, Math.max(0, Number(e.target.value))))} className="font-semibold text-red-500 bg-transparent outline-none w-7 text-xs" style={{ appearance: "textfield" }} /></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />P2: <input type="number" min={0} value={bannerP2} onChange={e => setBannerP2(Math.min(bannerOpen - bannerP1, Math.max(0, Number(e.target.value))))} className="font-semibold text-orange-500 bg-transparent outline-none w-7 text-xs" style={{ appearance: "textfield" }} /></div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />P3: <span className="font-semibold text-gray-600">{bannerP3}</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-px self-stretch bg-gray-300 flex-shrink-0" />
              {/* KPIs */}
              <div className="flex-shrink-0">
                <div className="mb-2"><span className="text-sm font-semibold text-gray-700">Key Performance Indicators (KPIs)</span></div>
                <div className="flex items-start gap-5">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5"><span className="text-xs text-gray-500 whitespace-nowrap">Avg. Resolution Time (ART)</span><KpiTooltip>Average time from ticket creation to resolution across all tickets closed in the current period.</KpiTooltip></div>
                    <div className="flex items-baseline gap-1.5"><span className="text-2xl font-bold text-gray-900">{KPI_BY_REGION[region].art}</span><span className="text-sm text-gray-400">/ {kpiArtTarget} hrs</span></div>
                  </div>
                  <div className="w-px bg-gray-300 flex-shrink-0 self-stretch" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5"><span className="text-xs text-gray-500 whitespace-nowrap">SLA Adherence</span><KpiTooltip>(Tickets resolved on time ÷ Total resolved) × 100%.</KpiTooltip></div>
                    <div className="flex items-baseline gap-1.5"><span className="text-2xl font-bold text-gray-900">{KPI_BY_REGION[region].sla}</span><span className="text-sm text-gray-400">/ {kpiSlaTarget}%</span></div>
                  </div>
                  <div className="w-px bg-gray-300 flex-shrink-0 self-stretch" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5"><span className="text-xs text-gray-500 whitespace-nowrap">Tickets Breaching SLA</span><KpiTooltip>Open tickets that have already exceeded their SLA deadline.</KpiTooltip></div>
                    <div className="flex items-baseline gap-1.5"><span className="text-2xl font-bold text-gray-900">{KPI_BY_REGION[region].breaching}</span><span className="text-sm text-gray-400">/ {kpiBreachTarget} target</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Analytics: 50/50 ── */}
          <div className="flex gap-4 items-stretch">
            <div className="flex-1 bg-white rounded border border-gray-200 p-5 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Ticket Trend (Last 30 Days)</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-red-500 inline-block rounded" /> P1</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-orange-500 inline-block rounded" /> P2</span>
                  <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-gray-400 inline-block rounded" /> P3</span>
                </div>
              </div>
              <LineChart data={lineData} />
            </div>
            <div className="flex-1 bg-white rounded border border-gray-200 p-5 min-w-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Case Distribution by L1 Type</h3>
              <DonutChart data={donutData} />
            </div>
          </div>

          {/* ── Station table ── */}
          <div className="bg-white rounded border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Station Breakdown</h3>
              <span className="text-xs text-gray-400">{tableRows.length} station{tableRows.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {(["Station ID", "Station Name", "Region"] as const).map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                    {([["Total Ticket","total"],["Closed","closed"],["Open","open"],["Health","health"],["ART","art"],["SLA","sla"],["Breaching SLA","breaching"]] as [string, SortCol][]).map(([label, col]) => (
                      <th key={col} onClick={() => handleSort(col)} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none">
                        {label}{sortIcon(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map(s => {
                    const h = stationHealth(s);
                    const open = s.total - s.closed;
                    return (
                      <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 font-mono text-xs text-gray-500 whitespace-nowrap">{s.id}</td>
                        <td className="px-4 py-2.5 text-gray-900 whitespace-nowrap">{s.name}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 font-medium">{s.region}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-900 font-medium">{s.total}</td>
                        <td className="px-4 py-2.5 text-green-700 font-medium">{s.closed}</td>
                        <td className="px-4 py-2.5 text-orange-600 font-medium">{open}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${healthChip(h)}`}>{h}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{s.art}</td>
                        <td className="px-4 py-2.5 text-gray-700 whitespace-nowrap">{s.sla}</td>
                        <td className="px-4 py-2.5 text-gray-700 font-medium">{s.breaching}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      <FloatingWhatsNew
        module="Dashboard — Control Tower"
        showFrf
        frfUrl="https://docs.google.com/document/d/1u5YZL3ARhbqQ4XHweymz8uFctdf1Qy0Fq5uMmPwcbys/edit?tab=t.0"
        changes={[
          {
            title: "FM / LM Tabs",
            description: "Page is split into FM and LM tabs. FM is fully built out; LM is a placeholder for future work.",
          },
          {
            title: "Market-Level Health Banner",
            description: "Shows Overall Health, Current Ticket Status (Total / Closed / Open + P1/P2/P3 breakdown), and KPIs — all reactive to the Region filter. Values are editable for demo.",
          },
          {
            title: "Region Filter",
            description: "Dropdown (All / North / South / Central / West / East) on the banner filters the health metrics, ticket trend chart, case distribution chart, and station table simultaneously.",
          },
          {
            title: "Ticket Trend Chart",
            description: "Line chart showing P1, P2, P3 case volume over the last 30 days. Hover the chart to see a tooltip with exact values per date point.",
          },
          {
            title: "Case Distribution Chart",
            description: "Donut chart showing proportion of Miss-Assignment [P1], No Movement from Driver [P1], and Dispatch Backup Driver [P2] — aligned with the FM Control Tower Metrics.",
          },
          {
            title: "Station Breakdown Table",
            description: "Lists all First Mile Hubs with ticket counts, health status, ART, SLA, and breaching SLA. Click any numeric column header to sort ascending or descending.",
          },
        ]}
      />
    </FMSLayout>
  );
}
