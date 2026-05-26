"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import FMSLayout from "@/components/FMSLayout";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";

type Priority = "P1" | "P2" | "P3";
type TicketStatus = "Cancelled" | "Created" | "Resolved";
type NavFilter = "all" | "related-to-me" | "own-by-my-team" | "related-to-my-team" | "ticket-center-driver";
type SortCol = "priority" | "createdTime" | "lastUpdated" | "sla" | null;
type SortDir = "asc" | "desc";

interface Ticket {
  id: string;
  title: string;
  priority: Priority;
  l1Type: string;
  l2Type: string;
  assignedStation: string;
  assignedTeam: string;
  assignee: string;
  createdTime: string;
  lastUpdated: string;
  sla: string;
  slaHours: number;
  autoClose: string;
  displayStatus: string;
  status: TicketStatus;
}

const ASSIGNEES = ["Eric Santos", "Maria Cruz", "Jose Reyes", "Anna Lim", "Bob Tan", "Lisa Go", "Mark Dy"];
const STATUSES: TicketStatus[] = ["Cancelled", "Created", "Resolved"];
const PRIORITIES: Priority[] = ["P1", "P2", "P3"];

const ALL_TICKETS: Ticket[] = [
  { id: "CT-00001", title: "Driver not showing up for pickup", priority: "P1", l1Type: "Driver Issue", l2Type: "No Show", assignedStation: "Pandan SC", assignedTeam: "Driver Support Team", assignee: "Eric Santos", createdTime: "2026-05-01 09:00", lastUpdated: "2026-05-01 09:45", sla: "24h", slaHours: 24, autoClose: "No", displayStatus: "Created", status: "Created" },
  { id: "CT-00002", title: "PUP configuration update needed", priority: "P2", l1Type: "Configuration", l2Type: "PUP Config", assignedStation: "Binan Hub", assignedTeam: "Control Tower Team", assignee: "Maria Cruz", createdTime: "2026-05-02 10:15", lastUpdated: "2026-05-02 11:00", sla: "12h", slaHours: 12, autoClose: "Yes", displayStatus: "Created", status: "Created" },
  { id: "CT-00003", title: "System access issue for station ops", priority: "P3", l1Type: "System Issue", l2Type: "Access Issue", assignedStation: "Depot 1", assignedTeam: "Hub Management Team", assignee: "Jose Reyes", createdTime: "2026-05-03 08:30", lastUpdated: "2026-05-04 14:20", sla: "48h", slaHours: 48, autoClose: "No", displayStatus: "Resolved", status: "Resolved" },
  { id: "CT-00004", title: "Customer complaint: lost package", priority: "P1", l1Type: "Customer Complaint", l2Type: "Lost Package", assignedStation: "Laguna Hub", assignedTeam: "Customer Care Team", assignee: "Anna Lim", createdTime: "2026-05-04 14:00", lastUpdated: "2026-05-04 16:30", sla: "8h", slaHours: 8, autoClose: "No", displayStatus: "Cancelled", status: "Cancelled" },
  { id: "CT-00005", title: "Zone routing misconfiguration", priority: "P2", l1Type: "Configuration", l2Type: "Zone Config", assignedStation: "Pandan SC", assignedTeam: "Control Tower Team", assignee: "Eric Santos", createdTime: "2026-05-05 11:00", lastUpdated: "2026-05-05 13:00", sla: "16h", slaHours: 16, autoClose: "Yes", displayStatus: "Created", status: "Created" },
  { id: "CT-00006", title: "Driver idling at pickup point", priority: "P1", l1Type: "Driver Issue", l2Type: "Driver Idling", assignedStation: "Depot 2", assignedTeam: "Driver Support Team", assignee: "Bob Tan", createdTime: "2026-05-06 08:00", lastUpdated: "2026-05-06 10:00", sla: "4h", slaHours: 4, autoClose: "No", displayStatus: "Created", status: "Created" },
  { id: "CT-00007", title: "Pickup failure at Pandan SC", priority: "P3", l1Type: "Operational", l2Type: "Pickup Failure", assignedStation: "Pandan SC", assignedTeam: "Station Ops Team", assignee: "Lisa Go", createdTime: "2026-05-07 15:30", lastUpdated: "2026-05-08 09:00", sla: "24h", slaHours: 24, autoClose: "Yes", displayStatus: "Resolved", status: "Resolved" },
  { id: "CT-00008", title: "Data sync error in FMS", priority: "P2", l1Type: "System Issue", l2Type: "Data Error", assignedStation: "Hub 3", assignedTeam: "Hub Management Team", assignee: "Mark Dy", createdTime: "2026-05-08 12:00", lastUpdated: "2026-05-08 14:00", sla: "8h", slaHours: 8, autoClose: "No", displayStatus: "Created", status: "Created" },
];

const PRIORITY_ORDER: Record<Priority, number> = { P1: 3, P2: 2, P3: 1 };
const stickyStatus = { position: "sticky" as const, right: 80, zIndex: 10, background: "white", boxShadow: "-2px 0 4px rgba(0,0,0,0.06)" };
const stickyAction = { position: "sticky" as const, right: 0, zIndex: 10, background: "white" };

export default function WorkspacePage() {
  // Banner ticket counts (editable)
  const [bannerTotal, setBannerTotal] = useState(12);
  const [bannerClosed, setBannerClosed] = useState(6);
  const [bannerP1, setBannerP1] = useState(2);
  const [bannerP2, setBannerP2] = useState(2);

  // Health thresholds — configured centrally in Control Tower Dashboard
  const healthyThreshold = 80;
  const criticalThreshold = 20;

  // KPI targets — configured centrally in Control Tower Dashboard
  const kpiArtTarget = 2;
  const kpiSlaTarget = 98;
  const kpiBreachTarget = 0;

  const bannerOpen = Math.max(0, bannerTotal - bannerClosed);
  const bannerP3 = Math.max(0, bannerOpen - bannerP1 - bannerP2);
  const closedPct = bannerTotal > 0 ? (bannerClosed / bannerTotal) * 100 : 0;
  const health = closedPct >= healthyThreshold ? "Healthy" : closedPct >= criticalThreshold ? "Moderate" : "Critical";
  const healthColor = health === "Healthy" ? "text-green-600" : health === "Moderate" ? "text-yellow-600" : "text-red-600";
  const bannerBg = health === "Healthy" ? "bg-green-50 border-green-200" : health === "Moderate" ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  const [inOffice, setInOffice] = useState(false);
  const [navFilter, setNavFilter] = useState<NavFilter>("all");

  const [ticketId, setTicketId] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [applied, setApplied] = useState({ ticketId: "", ticketTitle: "", priorityFilter: "", assigneeFilter: "", statusFilter: "" });

  const [sortCol, setSortCol] = useState<SortCol>("priority");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const teamToDoCount = ALL_TICKETS.filter(t => t.assignedTeam === "Control Tower Team" && t.status === "Created").length;
  const assignedToMeCount = ALL_TICKETS.filter(t => t.assignee === "Eric Santos").length;
  const ownByMyTeamCount = ALL_TICKETS.filter(t => t.assignedTeam === "Control Tower Team").length;
  const relatedToMyTeamCount = ALL_TICKETS.filter(t => t.assignedTeam === "Control Tower Team" || t.assignee === "Eric Santos").length;
  const driverTicketCount = ALL_TICKETS.filter(t => t.l1Type === "Driver Issue").length;

  const handleSearch = () => { setApplied({ ticketId, ticketTitle, priorityFilter, assigneeFilter, statusFilter }); setCurrentPage(1); };
  const handleReset = () => {
    setTicketId(""); setTicketTitle(""); setPriorityFilter(""); setAssigneeFilter(""); setStatusFilter("");
    setApplied({ ticketId: "", ticketTitle: "", priorityFilter: "", assigneeFilter: "", statusFilter: "" });
    setCurrentPage(1);
  };

  const handleSort = (col: SortCol) => {
    if (sortCol === col) { if (sortDir === "asc") setSortDir("desc"); else { setSortCol(null); setSortDir("asc"); } }
    else { setSortCol(col); setSortDir("asc"); }
  };
  const sortIcon = (col: SortCol) => {
    if (sortCol !== col) return <span className="text-gray-400 ml-1 font-normal">↕</span>;
    return <span className="text-blue-600 ml-1 font-normal">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const filtered = useMemo(() => {
    let data = [...ALL_TICKETS];
    if (navFilter === "related-to-me") data = data.filter(t => t.assignee === "Eric Santos");
    else if (navFilter === "own-by-my-team") data = data.filter(t => t.assignedTeam === "Control Tower Team");
    else if (navFilter === "related-to-my-team") data = data.filter(t => t.assignedTeam === "Control Tower Team" || t.assignee === "Eric Santos");
    else if (navFilter === "ticket-center-driver") data = data.filter(t => t.l1Type === "Driver Issue");
    if (applied.ticketId) data = data.filter(t => t.id.toLowerCase().includes(applied.ticketId.toLowerCase()));
    if (applied.ticketTitle) data = data.filter(t => t.title.toLowerCase().includes(applied.ticketTitle.toLowerCase()));
    if (applied.priorityFilter) data = data.filter(t => t.priority === applied.priorityFilter);
    if (applied.assigneeFilter) data = data.filter(t => t.assignee === applied.assigneeFilter);
    if (applied.statusFilter) data = data.filter(t => t.status === applied.statusFilter);
    if (sortCol) {
      data.sort((a, b) => {
        let av: number | string = 0, bv: number | string = 0;
        if (sortCol === "priority") { av = PRIORITY_ORDER[a.priority]; bv = PRIORITY_ORDER[b.priority]; }
        else if (sortCol === "createdTime") { av = a.createdTime; bv = b.createdTime; }
        else if (sortCol === "lastUpdated") { av = a.lastUpdated; bv = b.lastUpdated; }
        else if (sortCol === "sla") { av = a.slaHours; bv = b.slaHours; }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [navFilter, applied, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goTo = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  const priorityClass = (p: Priority) => {
    if (p === "P1") return "text-red-600 font-bold";
    if (p === "P2") return "text-orange-500 font-medium";
    return "text-gray-500";
  };
  const statusDot = (s: TicketStatus) => {
    if (s === "Created") return "bg-orange-400";
    if (s === "Resolved") return "bg-green-500";
    return "bg-gray-400";
  };
  const rowBg = (t: Ticket) => {
    if (t.status !== "Created") return "border-b border-gray-100 hover:bg-gray-50 transition-colors";
    if (t.priority === "P1") return "border-b border-red-100 bg-red-50 hover:bg-red-100 transition-colors";
    if (t.priority === "P2") return "border-b border-orange-50 bg-orange-50 hover:bg-orange-100 transition-colors";
    return "border-b border-gray-100 hover:bg-gray-50 transition-colors";
  };
  const firstCellLeft = (t: Ticket) => {
    if (t.status !== "Created") return "px-4 py-3 whitespace-nowrap pl-3";
    if (t.priority === "P1") return "px-4 py-3 whitespace-nowrap pl-3 border-l-[3px] border-l-red-500";
    if (t.priority === "P2") return "px-4 py-3 whitespace-nowrap pl-3 border-l-[3px] border-l-orange-400";
    return "px-4 py-3 whitespace-nowrap pl-3 border-l-[3px] border-l-transparent";
  };

  const p1OpenCount = filtered.filter(t => t.priority === "P1" && t.status === "Created").length;
  const slaBreachCount = filtered.filter(t => t.slaHours <= 8 && t.status === "Created").length;

  const navItems: { key: NavFilter; label: string; count: number }[] = [
    { key: "related-to-me", label: "Related to me", count: assignedToMeCount },
    { key: "own-by-my-team", label: "Own by my team", count: ownByMyTeamCount },
    { key: "related-to-my-team", label: "Related To My Team", count: relatedToMyTeamCount },
    { key: "ticket-center-driver", label: "Ticket Center - Driver", count: driverTicketCount },
  ];

  return (
    <FMSLayout breadcrumbs={[{ label: "Case Management" }, { label: "Workspace" }]}>
      <div className="-m-6 flex" style={{ minHeight: "calc(100vh - 56px)" }}>

        {/* Left Panel */}
        <div className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Workspace</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">In Office</span>
              <button onClick={() => setInOffice(v => !v)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${inOffice ? "bg-blue-600" : "bg-gray-200"}`}>
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${inOffice ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
          <div className="px-4 py-3 border-b border-gray-100 space-y-2">
            {[["Team To Do", teamToDoCount], ["Team Unassigned", 0], ["Assigned To Me", assignedToMeCount]].map(([label, val]) => (
              <div key={label as string} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
          <nav className="flex-1 py-2">
            {navItems.map((item) => (
              <button key={item.key}
                onClick={() => { setNavFilter(navFilter === item.key ? "all" : item.key); setCurrentPage(1); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${navFilter === item.key ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600" : "text-gray-700 hover:bg-gray-50"}`}>
                <span className="truncate leading-tight">{item.label}</span>
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium flex-shrink-0 ml-1.5 ${navFilter === item.key ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{item.count}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 min-w-0 bg-gray-50">

          {/* Health Banner */}
          <div className={`rounded border mb-3 px-6 py-4 ${bannerBg}`}>

            {/* Banner content row */}
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
                <div className={`text-3xl font-bold ${healthColor}`}>{health}</div>
                <div className={`text-sm font-medium mt-0.5 ${healthColor} opacity-75`}>{Math.round(closedPct)}% closed</div>
              </div>

              <div className="w-px self-stretch bg-gray-300 flex-shrink-0" />

              {/* Current Ticket Status */}
              <div className="flex-shrink-0">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Current Ticket Status</span>
                  <KpiTooltip>
                    <p className="font-semibold mb-1.5">Ticket counting rules:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block flex-shrink-0" /><span><b>Closed</b>: status is Resolved or Cancelled</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block flex-shrink-0" /><span><b>Open</b>: status is Created</span></div>
                    </div>
                  </KpiTooltip>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Total Ticket</div>
                    <input type="number" min={0} value={bannerTotal}
                      onChange={e => { const v = Math.max(0, Number(e.target.value)); setBannerTotal(v); if (bannerClosed > v) { setBannerClosed(v); setBannerP1(0); setBannerP2(0); } }}
                      className="text-2xl font-bold bg-transparent outline-none w-14 text-gray-900" style={{ appearance: "textfield" }} />
                  </div>
                  <div className="w-px h-10 bg-gray-300 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Closed</div>
                    <input type="number" min={0} value={bannerClosed}
                      onChange={e => { const v = Math.min(bannerTotal, Math.max(0, Number(e.target.value))); setBannerClosed(v); const o = Math.max(0, bannerTotal - v); if (bannerP1 + bannerP2 > o) { setBannerP1(0); setBannerP2(0); } }}
                      className="text-2xl font-bold bg-transparent outline-none w-14 text-gray-900" style={{ appearance: "textfield" }} />
                  </div>
                  <div className="w-px h-10 bg-gray-300 flex-shrink-0" />
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs font-semibold text-red-600 mb-0.5">Open</div>
                      <span className="text-2xl font-bold text-red-600">{bannerOpen}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        P1: <input type="number" min={0} value={bannerP1} onChange={e => setBannerP1(Math.min(bannerOpen, Math.max(0, Number(e.target.value))))} className="font-semibold text-red-500 bg-transparent outline-none w-6 text-xs" style={{ appearance: "textfield" }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                        P2: <input type="number" min={0} value={bannerP2} onChange={e => setBannerP2(Math.min(bannerOpen - bannerP1, Math.max(0, Number(e.target.value))))} className="font-semibold text-orange-500 bg-transparent outline-none w-6 text-xs" style={{ appearance: "textfield" }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                        P3: <span className="font-semibold text-gray-600">{bannerP3}</span>
                      </div>
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
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs text-gray-500 whitespace-nowrap">Avg. Resolution Time (ART)</span>
                      <KpiTooltip>Average time from ticket creation to resolution, calculated across all tickets closed in the current period.</KpiTooltip>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">4.2 hrs</span>
                      <span className="text-sm text-gray-400">/ {kpiArtTarget} hrs</span>
                    </div>
                  </div>
                  <div className="w-px bg-gray-300 flex-shrink-0 self-stretch" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs text-gray-500 whitespace-nowrap">SLA Adherence</span>
                      <KpiTooltip>Percentage of tickets resolved within the defined SLA deadline. Calculated as: (Tickets resolved on time ÷ Total resolved tickets) × 100%.</KpiTooltip>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">95%</span>
                      <span className="text-sm text-gray-400">/ {kpiSlaTarget}%</span>
                    </div>
                  </div>
                  <div className="w-px bg-gray-300 flex-shrink-0 self-stretch" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs text-gray-500 whitespace-nowrap">Tickets Breaching SLA</span>
                      <KpiTooltip>Count of currently open tickets that have already exceeded their SLA deadline.</KpiTooltip>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-gray-900">2</span>
                      <span className="text-sm text-gray-400">/ {kpiBreachTarget} target</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded border border-gray-200 p-4 mb-3">
            <div className="grid grid-cols-3 gap-x-8 gap-y-2.5 mb-2.5">
              <WsFilterItem label="Ticket ID">
                <input type="text" value={ticketId} onChange={e => setTicketId(e.target.value)} placeholder="Input" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0" />
              </WsFilterItem>
              <WsFilterItem label="Ticket Title">
                <input type="text" value={ticketTitle} onChange={e => setTicketTitle(e.target.value)} placeholder="Input" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0" />
              </WsFilterItem>
              <WsFilterItem label="Priority">
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                  <option value="">Select</option>
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </WsFilterItem>
            </div>
            <div className="flex items-center gap-8">
              <div className="grid grid-cols-2 gap-x-8 flex-1">
                <WsFilterItem label="Assignee">
                  <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                    <option value="">Select</option>
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </WsFilterItem>
                <WsFilterItem label="Status">
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                    <option value="">Select</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </WsFilterItem>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
                <button onClick={handleReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
                <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">
                  More <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Needs Attention strip */}
          {(p1OpenCount > 0 || slaBreachCount > 0) ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2 mb-3 bg-red-50 border border-red-200 rounded">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide flex-shrink-0">Needs Attention</span>
              <div className="w-px h-4 bg-red-300 flex-shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5">
                {p1OpenCount > 0 && (
                  <button
                    onClick={() => { setPriorityFilter("P1"); setStatusFilter("Created"); setApplied(a => ({ ...a, priorityFilter: "P1", statusFilter: "Created" })); setCurrentPage(1); }}
                    className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block flex-shrink-0" />
                    {p1OpenCount} P1 unresolved
                  </button>
                )}
                {slaBreachCount > 0 && (
                  <button
                    onClick={() => { setStatusFilter("Created"); setApplied(a => ({ ...a, statusFilter: "Created", priorityFilter: "" })); setCurrentPage(1); }}
                    className="flex items-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block flex-shrink-0" />
                    {slaBreachCount} tickets with SLA ≤ 8h
                  </button>
                )}
              </div>
              <span className="text-xs text-red-400 ml-auto flex-shrink-0">Click a chip to filter</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 mb-3 bg-green-50 border border-green-200 rounded text-xs text-green-700 font-medium">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              All clear — no urgent tickets in current view
            </div>
          )}

          {/* Table card */}
          <div className="bg-white rounded border border-gray-200">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">Create Ticket</button>
              <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">Batch Create <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">Batch Action <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition-colors ml-auto">Export</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "separate", minWidth: "1600px" }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Ticket ID</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap" style={{ minWidth: "200px" }}>Ticket Title</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("priority")}>Priority{sortIcon("priority")}</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">L1 Case Type</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">L2 Case Type</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Assigned Station</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Assigned Team</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Assignee</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("createdTime")}>Created Time{sortIcon("createdTime")}</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("lastUpdated")}>Last Updated{sortIcon("lastUpdated")}</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none" onClick={() => handleSort("sla")}>SLA{sortIcon("sla")}</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Auto Close</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Display Status</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap" style={stickyStatus}>Status</th>
                    <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap" style={stickyAction}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={15} className="text-center py-12 text-gray-400">No data found</td></tr>
                  ) : paged.map((t) => (
                    <tr key={t.id} className={rowBg(t)}>
                      <td className={firstCellLeft(t)}><span className="text-blue-600 hover:underline cursor-pointer font-mono text-xs">{t.id}</span></td>
                      <td className="px-4 py-3 text-gray-900" style={{ maxWidth: "200px" }}><span className="block truncate" title={t.title}>{t.title}</span></td>
                      <td className={`px-4 py-3 whitespace-nowrap ${priorityClass(t.priority)}`}>{t.priority}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.l1Type}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.l2Type}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.assignedStation}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.assignedTeam}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.assignee}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.createdTime}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.lastUpdated}</td>
                      <td className={`px-4 py-3 whitespace-nowrap font-medium ${t.slaHours <= 8 ? "text-red-500" : t.slaHours <= 16 ? "text-orange-500" : "text-gray-900"}`}>{t.sla}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.autoClose}</td>
                      <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{t.displayStatus}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={stickyStatus}>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot(t.status)}`} />
                          <span className="text-gray-900">{t.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={stickyAction}>
                        <Link href={`/control-tower/workspace/${t.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Total: {filtered.length}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => goTo(1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-xs">{"<<"}</button>
                <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{"<"}</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                  return <button key={page} onClick={() => goTo(page)} className={`w-7 h-7 flex items-center justify-center rounded text-xs border transition-colors ${page === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{page}</button>;
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (<><span className="text-gray-400 text-xs">...</span><button onClick={() => goTo(totalPages)} className="w-7 h-7 flex items-center justify-center rounded text-xs border border-gray-300 text-gray-600 hover:border-red-400">{totalPages}</button></>)}
                <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{">"}</button>
                <button onClick={() => goTo(totalPages)} disabled={currentPage === totalPages || totalPages === 0} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-xs">{">>"}</button>
                <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600 bg-white ml-2">
                  <option value={10}>10 / Page</option>
                  <option value={20}>20 / Page</option>
                  <option value={50}>50 / Page</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>
      <FloatingWhatsNew
        module="Case Management — Workspace"
        showFrf
        frfUrl="https://docs.google.com/document/d/1u5YZL3ARhbqQ4XHweymz8uFctdf1Qy0Fq5uMmPwcbys/edit?tab=t.0"
        changes={[
          {
            title: "Health Banner",
            description: "New banner at the top shows overall health status (Healthy / Moderate / Critical) based on the ratio of closed tickets. Values are editable to simulate different states.",
          },
          {
            title: "Ticket Status Breakdown",
            description: "Banner shows Total, Closed, and Open ticket counts with a P1 / P2 / P3 breakdown of open tickets. All inputs are live-editable.",
          },
          {
            title: "Key Performance Indicators (KPIs)",
            description: "Banner includes Avg. Resolution Time, SLA Adherence, and Tickets Breaching SLA — each with a target value and an explanatory tooltip.",
          },
          {
            title: "Centralized Configuration",
            description: "Health thresholds and KPI targets are configured in the Control Tower Dashboard. Workspace reflects those settings automatically.",
          },
        ]}
      />
    </FMSLayout>
  );
}

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


function WsFilterItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap w-28 flex-shrink-0">{label}</span>
      {children}
    </div>
  );
}
