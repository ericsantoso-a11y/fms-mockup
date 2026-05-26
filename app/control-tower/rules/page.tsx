"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";

type Priority = "High" | "Medium" | "Low";
type RuleStatus = "Available" | "Unavailable";

interface Rule {
  id: string;
  ruleName: string;
  priority: Priority;
  dataSource: string;
  metricType: string;
  caseTemplate: string;
  operator: string;
  updatedAt: string;
  status: RuleStatus;
}

const DATA_SOURCES = ["Dashboard", "FMS", "Driver App"];
const METRIC_TYPES = ["Operation", "Finance", "Quality"];
const CASE_TEMPLATES = [
  "[Template ID] High On-hold Rate Template",
  "[Template ID] No Movement Template",
  "[Template ID] Miss-Assignment Template",
  "[Template ID] Dispatch Backup Template",
];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const STATUSES: RuleStatus[] = ["Available", "Unavailable"];

const ALL_RULES: Rule[] = [
  { id: "R-001", ruleName: "High On-hold Rate", priority: "High", dataSource: "Dashboard", metricType: "Operation", caseTemplate: CASE_TEMPLATES[0], operator: "xiaojun.gu@shopee.com", updatedAt: "2026/05/01 09:00", status: "Available" },
  { id: "R-002", ruleName: "High On-hold Rate", priority: "Medium", dataSource: "Dashboard", metricType: "Operation", caseTemplate: CASE_TEMPLATES[0], operator: "xiaojun.gu@shopee.com", updatedAt: "2026/05/01 09:00", status: "Unavailable" },
  { id: "R-003", ruleName: "High On-hold Rate", priority: "Low", dataSource: "Dashboard", metricType: "Operation", caseTemplate: CASE_TEMPLATES[0], operator: "xiaojun.gu@shopee.com", updatedAt: "2026/05/01 09:00", status: "Available" },
  { id: "R-004", ruleName: "No Movement from Driver", priority: "High", dataSource: "FMS", metricType: "Operation", caseTemplate: CASE_TEMPLATES[1], operator: "eric.santos@shopee.com", updatedAt: "2026/05/03 11:30", status: "Available" },
  { id: "R-005", ruleName: "No Movement from Driver", priority: "Medium", dataSource: "FMS", metricType: "Operation", caseTemplate: CASE_TEMPLATES[1], operator: "eric.santos@shopee.com", updatedAt: "2026/05/03 11:30", status: "Available" },
  { id: "R-006", ruleName: "Miss-Assignment Alert", priority: "High", dataSource: "Dashboard", metricType: "Quality", caseTemplate: CASE_TEMPLATES[2], operator: "maria.cruz@shopee.com", updatedAt: "2026/05/10 14:00", status: "Available" },
  { id: "R-007", ruleName: "Miss-Assignment Alert", priority: "Low", dataSource: "Dashboard", metricType: "Quality", caseTemplate: CASE_TEMPLATES[2], operator: "maria.cruz@shopee.com", updatedAt: "2026/05/10 14:00", status: "Unavailable" },
  { id: "R-008", ruleName: "Dispatch Backup Driver", priority: "Medium", dataSource: "Driver App", metricType: "Operation", caseTemplate: CASE_TEMPLATES[3], operator: "anna.lim@shopee.com", updatedAt: "2026/05/15 08:45", status: "Available" },
];

export default function ControlTowerRulesPage() {
  const router = useRouter();
  const [ruleNameFilter, setRuleNameFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dataSourceFilter, setDataSourceFilter] = useState("");
  const [metricTypeFilter, setMetricTypeFilter] = useState("");
  const [caseTemplateFilter, setCaseTemplateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [applied, setApplied] = useState({
    ruleName: "", priority: "", dataSource: "", metricType: "", caseTemplate: "", status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [goToPage, setGoToPage] = useState("");

  const handleSearch = () => {
    setApplied({ ruleName: ruleNameFilter, priority: priorityFilter, dataSource: dataSourceFilter, metricType: metricTypeFilter, caseTemplate: caseTemplateFilter, status: statusFilter });
    setCurrentPage(1);
  };
  const handleReset = () => {
    setRuleNameFilter(""); setPriorityFilter(""); setDataSourceFilter("");
    setMetricTypeFilter(""); setCaseTemplateFilter(""); setStatusFilter("");
    setApplied({ ruleName: "", priority: "", dataSource: "", metricType: "", caseTemplate: "", status: "" });
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...ALL_RULES];
    if (applied.ruleName) data = data.filter(r => r.ruleName.toLowerCase().includes(applied.ruleName.toLowerCase()));
    if (applied.priority) data = data.filter(r => r.priority === applied.priority);
    if (applied.dataSource) data = data.filter(r => r.dataSource === applied.dataSource);
    if (applied.metricType) data = data.filter(r => r.metricType === applied.metricType);
    if (applied.caseTemplate) data = data.filter(r => r.caseTemplate === applied.caseTemplate);
    if (applied.status) data = data.filter(r => r.status === applied.status);
    return data;
  }, [applied]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goTo = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };

  const priorityDot = (p: Priority) => {
    if (p === "High") return "bg-red-500";
    if (p === "Medium") return "bg-yellow-400";
    return "bg-green-500";
  };
  const statusClass = (s: RuleStatus) =>
    s === "Available" ? "text-green-600 font-medium" : "text-red-500 font-medium";

  return (
    <FMSLayout breadcrumbs={[{ label: "Rules" }, { label: "Control Tower Rules" }]}>
      <div className="space-y-3">

        {/* Filters */}
        <div className="bg-white rounded border border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-x-8 gap-y-2.5 mb-2.5">
            <FilterItem label="Rule Name">
              <input
                type="text"
                value={ruleNameFilter}
                onChange={e => setRuleNameFilter(e.target.value)}
                placeholder="Input"
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0"
              />
            </FilterItem>
            <FilterItem label="Priority">
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                <option value="">Select</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </FilterItem>
            <FilterItem label="Data Source">
              <select value={dataSourceFilter} onChange={e => setDataSourceFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                <option value="">Select</option>
                {DATA_SOURCES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FilterItem>
            <FilterItem label="Metric Type">
              <select value={metricTypeFilter} onChange={e => setMetricTypeFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                <option value="">Select</option>
                {METRIC_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FilterItem>
            <FilterItem label="Case Template">
              <select value={caseTemplateFilter} onChange={e => setCaseTemplateFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                <option value="">Select</option>
                {CASE_TEMPLATES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterItem>
            <FilterItem label="Status">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 bg-white text-gray-600">
                <option value="">Select</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FilterItem>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
            <button onClick={handleReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded border border-gray-200">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200">
            <button onClick={() => router.push("/control-tower/rules/create")} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">Create Rule</button>
            <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Log</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Rule Name</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Priority</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Data Source</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Metric Type</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap" style={{ minWidth: 200 }}>Case Template</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Operator</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Updated</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-900 text-left whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-gray-400">No data found</td></tr>
                ) : paged.map(r => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{r.ruleName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot(r.priority)}`} />
                        <span className="text-gray-900">{r.priority}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{r.dataSource}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{r.metricType}</td>
                    <td className="px-4 py-3 text-gray-700" style={{ maxWidth: 220 }}>
                      <span className="block truncate" title={r.caseTemplate}>{r.caseTemplate}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap" style={{ maxWidth: 160 }}>
                      <span className="block truncate" title={r.operator}>{r.operator}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{r.updatedAt}</td>
                    <td className={`px-4 py-3 whitespace-nowrap ${statusClass(r.status)}`}>{r.status}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="flex items-center gap-2">
                        <button className="text-blue-600 hover:underline text-sm">View</button>
                        <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-sm text-gray-500">Total: {filtered.length}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{"<"}</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                return (
                  <button key={page} onClick={() => goTo(page)} className={`w-7 h-7 flex items-center justify-center rounded text-xs border transition-colors ${page === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{page}</button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <><span className="text-gray-400 text-xs">...</span><button onClick={() => goTo(totalPages)} className="w-7 h-7 flex items-center justify-center rounded text-xs border border-gray-300 text-gray-600 hover:border-red-400">{totalPages}</button></>
              )}
              <button onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{">"}</button>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-600 bg-white ml-2">
                <option value={20}>20 / Page</option>
                <option value={50}>50 / Page</option>
              </select>
              <span className="text-sm text-gray-500 ml-2">Go to page</span>
              <input
                type="number"
                value={goToPage}
                onChange={e => setGoToPage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { goTo(Number(goToPage)); setGoToPage(""); } }}
                className="w-14 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-400"
              />
              <button onClick={() => { goTo(Number(goToPage)); setGoToPage(""); }} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm transition-colors">Go</button>
            </div>
          </div>
        </div>

      </div>
    </FMSLayout>
  );
}

function FilterItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap w-28 flex-shrink-0">{label}</span>
      {children}
    </div>
  );
}
