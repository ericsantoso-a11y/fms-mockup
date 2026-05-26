"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";

// ── Data ──────────────────────────────────────────────────────────────────────

const CASE_TEMPLATES = [
  { id: "TPL-001", name: "High On-hold Rate Template", version: "v1.0", action: "1. Contact the driver via FMS Chat to confirm pickup status.\n2. If driver is unresponsive for 15 min, escalate to station lead.\n3. Log escalation reason and update ticket with resolution notes." },
  { id: "TPL-002", name: "No Movement Template", version: "v1.0", action: "1. Verify driver's last GPS location in FMS.\n2. Attempt contact via FMS Chat; wait 20 min for response.\n3. If unresponsive, dispatch backup driver and notify station lead.\n4. Update ticket with incident log." },
  { id: "TPL-003", name: "Miss-Assignment Template", version: "v1.0", action: "1. Review assignment data and identify the mis-assigned driver.\n2. Re-assign order to the correct driver or station.\n3. Notify all affected parties of the change.\n4. Document the reassignment reason in the ticket." },
  { id: "TPL-004", name: "Dispatch Backup Driver Template", version: "v1.0", action: "1. Identify the nearest available backup driver via FMS.\n2. Reassign the pickup order to the backup driver.\n3. Notify the original driver and station lead.\n4. Update ticket status and record backup dispatch log." },
];

const METRICS: Record<string, Record<string, string[]>> = {
  Admin: {
    "Dashboard Name 1": ["High On-hold Rate", "Pickup Success Rate", "Miss-Assignment Rate"],
    "Dashboard Name 2": ["No Movement Rate", "Dispatch Rate", "SLA Breach Rate"],
    "Dashboard Name 3": ["Driver Response Time", "Escalation Rate"],
  },
  Station: {
    "Hub Operations": ["Hub Capacity Utilization", "Processing Time", "Pending Pickup Count"],
    "Driver Performance": ["Driver Availability", "Route Efficiency", "On-time Rate"],
  },
};

const INTERVAL_OPTIONS = ["15 min", "30 min", "45 min", "1 h", "1 h 15 min", "1 h 30 min", "1 h 45 min", "2 h"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const STATIONS = [
  "Pandan SC", "Binan Hub", "Depot 1", "Laguna Hub", "Depot 2", "Hub 3",
  "Cengkareng First Mile Hub", "Sunter First Mile Hub", "Bekasi First Mile Hub",
  "Tangerang First Mile Hub", "Depok First Mile Hub", "Bogor First Mile Hub",
  "Cikarang First Mile Hub", "Karawang First Mile Hub", "Serpong First Mile Hub",
  "Bintaro First Mile Hub", "Kelapa Gading First Mile Hub",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Criteria { metric: string; threshold: "Fixed Value" | "Data Table"; }
interface WeeklyRow { day: string; time: string; }

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateRulePage() {
  const router = useRouter();

  // Basic Info
  const [ruleName, setRuleName] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low" | "">("");
  const [ruleStatus, setRuleStatus] = useState<"Available" | "Unavailable">("Available");

  // Rule Config
  const [dataSource, setDataSource] = useState<"Dashboard" | "Custom Table">("Dashboard");
  const [metricType, setMetricType] = useState<"Operation" | "Global">("Operation");
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [scope, setScope] = useState<"All" | "Selected Driver" | "Selected Station" | "">("");
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const stationDropdownRef = useRef<HTMLDivElement>(null);
  const [evalFreq, setEvalFreq] = useState<"Real-time" | "Daily" | "Weekly" | "">("");
  const [interval, setIntervalVal] = useState("");
  const [dailyTimes, setDailyTimes] = useState<string[]>([]);
  const [newDailyTime, setNewDailyTime] = useState("08:00");
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>([{ day: "", time: "" }]);
  const [skipDuplicate, setSkipDuplicate] = useState(false);
  const [perScopeLimit, setPerScopeLimit] = useState(false);
  const [maxPer2Hours, setMaxPer2Hours] = useState("");
  const [maxPerDay, setMaxPerDay] = useState("");

  // Case Config
  const [caseTemplate, setCaseTemplate] = useState("");
  const [recordTime, setRecordTime] = useState(false);
  const [autoResolve, setAutoResolve] = useState(false);

  // Set Criteria modal
  const [showModal, setShowModal] = useState(false);
  const [modalCat, setModalCat] = useState("");
  const [modalDash, setModalDash] = useState("");
  const [modalMetric, setModalMetric] = useState("");
  const [modalThreshold, setModalThreshold] = useState<"Fixed Value" | "Data Table" | "">("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setShowModal(false);
    };
    if (showModal) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showModal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (stationDropdownRef.current && !stationDropdownRef.current.contains(e.target as Node))
        setStationDropdownOpen(false);
    };
    if (stationDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [stationDropdownOpen]);

  const toggleStation = (s: string) =>
    setSelectedStations(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const removeStation = (s: string) => setSelectedStations(prev => prev.filter(x => x !== s));

  const openModal = () => {
    setModalCat(""); setModalDash(""); setModalMetric(""); setModalThreshold("");
    setShowModal(true);
  };
  const confirmCriteria = () => {
    if (!modalMetric || !modalThreshold) return;
    setCriteriaList(prev => [...prev, { metric: modalMetric, threshold: modalThreshold }]);
    setShowModal(false);
  };
  const removeCriteria = (i: number) => setCriteriaList(prev => prev.filter((_, j) => j !== i));

  const addDailyTime = () => {
    if (!newDailyTime || dailyTimes.includes(newDailyTime) || dailyTimes.length >= 7) return;
    setDailyTimes(prev => [...prev, newDailyTime].sort());
  };
  const addWeeklyRow = () => {
    if (weeklyRows.length >= 7) return;
    setWeeklyRows(prev => [...prev, { day: "", time: "" }]);
  };
  const updateWeeklyRow = (i: number, field: keyof WeeklyRow, val: string) =>
    setWeeklyRows(prev => prev.map((r, j) => j === i ? { ...r, [field]: val } : r));
  const removeWeeklyRow = (i: number) => setWeeklyRows(prev => prev.filter((_, j) => j !== i));

  const selectedTemplate = CASE_TEMPLATES.find(t => `[${t.id}] ${t.name} (${t.version})` === caseTemplate);
  const actionText = selectedTemplate?.action ?? "";

  return (
    <FMSLayout breadcrumbs={[{ label: "Rules" }, { label: "Control Tower Rules", href: "/control-tower/rules" }, { label: "Create" }]}>
      <div className="max-w-2xl space-y-8 pb-12">

        {/* ── Basic Info ── */}
        <section>
          <SectionTitle>Basic Info</SectionTitle>
          <div className="space-y-5 mt-4">
            <FormRow label="Rule Name" required>
              <div className="relative">
                <input type="text" value={ruleName} onChange={e => setRuleName(e.target.value.slice(0, 150))}
                  placeholder="Input"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 pr-14" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{ruleName.length}/150</span>
              </div>
            </FormRow>
            <FormRow label="Priority" required>
              <div className="flex items-center gap-6">
                {(["High", "Medium", "Low"] as const).map(p => (
                  <label key={p} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                    <RadioBtn checked={priority === p} onChange={() => setPriority(p)} /> {p}
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="Rule Status" required>
              <div className="flex items-center gap-6">
                {(["Available", "Unavailable"] as const).map(s => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                    <RadioBtn checked={ruleStatus === s} onChange={() => setRuleStatus(s)} /> {s}
                  </label>
                ))}
              </div>
            </FormRow>
          </div>
        </section>

        {/* ── Rule Config ── */}
        <section>
          <SectionTitle>Rule Config</SectionTitle>
          <div className="space-y-5 mt-4">
            <FormRow label="Data Source" required>
              <div className="flex items-center gap-6">
                {(["Dashboard", "Custom Table"] as const).map(d => (
                  <label key={d} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                    <RadioBtn checked={dataSource === d} onChange={() => setDataSource(d)} /> {d}
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="Metric Type" required>
              <div className="flex items-center gap-6">
                {(["Operation", "Global"] as const).map(m => (
                  <label key={m} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                    <RadioBtn checked={metricType === m} onChange={() => setMetricType(m)} /> {m}
                  </label>
                ))}
              </div>
            </FormRow>

            {/* Condition */}
            <FormRow label="Condition" required>
              <div className="border border-gray-300 rounded min-h-[52px] p-2 flex flex-wrap gap-2 items-start">
                {criteriaList.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded max-w-full">
                    <span className="truncate">{c.metric} — {c.threshold}</span>
                    <button onClick={() => removeCriteria(i)} className="text-blue-400 hover:text-blue-700 ml-0.5 flex-shrink-0">×</button>
                  </span>
                ))}
                <button onClick={openModal}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-2 py-1 border border-dashed border-blue-300 rounded hover:bg-blue-50 transition-colors">
                  <span className="text-base leading-none">+</span> Add Criteria
                </button>
              </div>
            </FormRow>

            {/* Scope */}
            <FormRow label="Scope" required>
              <div className="space-y-3">
                {(["All", "Selected Driver", "Selected Station"] as const).map(opt => (
                  <div key={opt}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scope === opt}
                        onChange={() => setScope(scope === opt ? "" : opt)}
                        className="flex-shrink-0 accent-red-600"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>

                    {/* Selected Driver sub-UI */}
                    {opt === "Selected Driver" && scope === "Selected Driver" && (
                      <div className="ml-6 mt-2 flex items-center gap-2">
                        <label className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload File
                          <input type="file" accept=".csv,.xlsx" className="hidden" />
                        </label>
                        <button className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Template
                        </button>
                      </div>
                    )}

                    {/* Selected Station sub-UI */}
                    {opt === "Selected Station" && scope === "Selected Station" && (
                      <div className="ml-6 mt-2 space-y-2">
                        {/* Multi-select dropdown */}
                        <div ref={stationDropdownRef} className="relative">
                          <button
                            type="button"
                            onClick={() => setStationDropdownOpen(v => !v)}
                            className="w-full flex items-center justify-between border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-left focus:outline-none focus:border-blue-400 hover:border-gray-400 transition-colors"
                          >
                            <span className={selectedStations.length === 0 ? "text-gray-400" : "text-gray-700"}>
                              {selectedStations.length === 0 ? "Select stations…" : `${selectedStations.length} station${selectedStations.length > 1 ? "s" : ""} selected`}
                            </span>
                            <svg className={`w-4 h-4 text-gray-400 transition-transform ${stationDropdownOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {stationDropdownOpen && (
                            <div className="absolute z-30 top-full mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-52 overflow-y-auto">
                              {STATIONS.map(s => (
                                <label key={s} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedStations.includes(s)}
                                    onChange={() => toggleStation(s)}
                                    className="flex-shrink-0 accent-red-600"
                                  />
                                  <span className="text-sm text-gray-700">{s}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected chips */}
                        {selectedStations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {selectedStations.map(s => (
                              <span key={s} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-1 rounded">
                                {s}
                                <button onClick={() => removeStation(s)} className="text-blue-400 hover:text-blue-700 ml-0.5">×</button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Upload + Download */}
                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Upload File
                            <input type="file" accept=".csv,.xlsx" className="hidden" />
                          </label>
                          <button className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Template
                          </button>
                          <span className="text-xs text-gray-400">or select manually above</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FormRow>

            {/* Evaluation Frequency */}
            <FormRow label="Evaluation Frequency" required>
              <div className="space-y-2">
                {(["Real-time", "Daily", "Weekly"] as const).map(f => (
                  <label key={f} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                    <RadioBtn checked={evalFreq === f} onChange={() => setEvalFreq(f)} /> {f}
                  </label>
                ))}

                {/* Real-time: Interval dropdown */}
                {evalFreq === "Real-time" && (
                  <div className="ml-6 mt-2 flex items-center gap-2">
                    <span className="text-sm text-red-500 mr-0.5">*</span>
                    <span className="text-sm text-gray-600 w-16 flex-shrink-0">Interval</span>
                    <select value={interval} onChange={e => setIntervalVal(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-600 w-40">
                      <option value="">Select</option>
                      {INTERVAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                )}

                {/* Daily: Trigger Time tags */}
                {evalFreq === "Daily" && (
                  <div className="ml-6 mt-2 space-y-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm text-red-500">*</span>
                      <span className="text-sm text-gray-600">Trigger Time</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dailyTimes.map(t => (
                        <span key={t} className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded">
                          {t}
                          <button onClick={() => setDailyTimes(prev => prev.filter(x => x !== t))} className="text-gray-400 hover:text-gray-700 ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                    {dailyTimes.length < 7 && (
                      <div className="flex items-center gap-2">
                        <input type="time" value={newDailyTime} onChange={e => setNewDailyTime(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400" />
                        <button onClick={addDailyTime}
                          className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition-colors">
                          + Add
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">Max 7 entries. Duplicates will be ignored.</p>
                  </div>
                )}

                {/* Weekly: Trigger Time table */}
                {evalFreq === "Weekly" && (
                  <div className="ml-6 mt-2 space-y-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm text-red-500">*</span>
                      <span className="text-sm text-gray-600">Trigger Time</span>
                    </div>
                    <table className="w-full text-sm border border-gray-200 rounded overflow-hidden" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left font-medium text-gray-600 w-40">Day</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 w-32">Time</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600 w-16">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyRows.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-3 py-2">
                              <select value={row.day} onChange={e => updateWeeklyRow(i, "day", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-600">
                                <option value="">Select</option>
                                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <input type="time" value={row.time} onChange={e => updateWeeklyRow(i, "time", e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-400" />
                            </td>
                            <td className="px-3 py-2">
                              <button onClick={() => removeWeeklyRow(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {weeklyRows.length < 7 && (
                      <button onClick={addWeeklyRow}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                        <span className="text-base leading-none">+</span> Add Time
                      </button>
                    )}
                    <p className="text-xs text-gray-400">Max 7 entries.</p>
                  </div>
                )}
              </div>
            </FormRow>

            {/* Sensitivity */}
            <FormRow label="Sensitivity" required>
              <div className="space-y-3">
                <CheckOption checked={skipDuplicate} onChange={setSkipDuplicate}
                  title="Skip If Duplicate Ticket Exists"
                  description="Only create ticket & flag if a same ticket is not yet created for the same trigger rule." />

                <div>
                  <CheckOption checked={perScopeLimit} onChange={setPerScopeLimit}
                    title="Per-scope Rate Limits"
                    description="Limit the number of tickets generated within a specific time window." />
                  {perScopeLimit && (
                    <div className="ml-6 mt-2 space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">Max</span>
                        <input type="number" min={1} value={maxPer2Hours} onChange={e => setMaxPer2Hours(e.target.value)}
                          placeholder="—"
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-400" />
                        <span className="text-sm text-gray-600">tickets per 2 hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-8">Max</span>
                        <input type="number" min={1} value={maxPerDay} onChange={e => setMaxPerDay(e.target.value)}
                          placeholder="—"
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-blue-400" />
                        <span className="text-sm text-gray-600">tickets per day</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FormRow>
          </div>
        </section>

        {/* ── Case Config ── */}
        <section>
          <SectionTitle>Case Config</SectionTitle>
          <div className="space-y-5 mt-4">
            <FormRow label="Case Template" required>
              <select value={caseTemplate} onChange={e => setCaseTemplate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400 bg-white text-gray-600">
                <option value="">Select</option>
                {CASE_TEMPLATES.map(t => (
                  <option key={t.id} value={`[${t.id}] ${t.name} (${t.version})`}>
                    [{t.id}] {t.name} ({t.version})
                  </option>
                ))}
              </select>
            </FormRow>

            <FormRow label="Action Needed" required>
              <div>
                <textarea
                  value={actionText}
                  readOnly
                  rows={5}
                  placeholder={caseTemplate ? "" : "Select a Case Template to auto-fill action steps."}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50 text-gray-700 resize-none cursor-default focus:outline-none placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Auto-filled based on the selected Case Template. Not editable.</p>
              </div>
            </FormRow>

            <FormRow label="Resolution Check" required>
              <div className="space-y-4">
                <CheckOption checked={recordTime} onChange={setRecordTime}
                  title="Record Time When Metric Target is Achieved"
                  description="Log metric target achievement details in the Case Management workspace sidebar (Case Management > Workspace > Sidebar)." />
                <CheckOption checked={autoResolve} onChange={setAutoResolve}
                  title="Auto-resolve Ticket once Metric Target is Achieved"
                  description='Automatically change ticket status to "Resolved" when target is met and identify as system. Provide information why the ticket is auto-resolved.' />
              </div>
            </FormRow>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center gap-3 pt-2">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">Submit</button>
          <button onClick={() => router.back()} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-2 rounded text-sm transition-colors">Cancel</button>
        </div>
      </div>

      {/* ── Set Criteria Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[calc(100vh-96px)] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Set Criteria</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
            </div>

            <div className="p-5 space-y-5">
              {/* Metric — cascading selector */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  <span className="text-red-500 mr-0.5">*</span>Metric
                </label>
                <div className="border border-gray-200 rounded overflow-hidden flex text-sm" style={{ minHeight: 180 }}>
                  {/* Col 1: Category */}
                  <div className="w-28 flex-shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                    {Object.keys(METRICS).map(cat => (
                      <button key={cat} onClick={() => { setModalCat(cat); setModalDash(""); setModalMetric(""); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${modalCat === cat ? "bg-white text-red-600 font-medium" : "text-gray-700 hover:bg-white"}`}>
                        {cat}
                        <span className="text-gray-400 text-xs">›</span>
                      </button>
                    ))}
                  </div>
                  {/* Col 2: Dashboard */}
                  <div className="w-40 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
                    {modalCat && Object.keys(METRICS[modalCat]).map(dash => (
                      <button key={dash} onClick={() => { setModalDash(dash); setModalMetric(""); }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${modalDash === dash ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                        <span className="truncate">{dash}</span>
                        <span className="text-gray-400 text-xs ml-1 flex-shrink-0">›</span>
                      </button>
                    ))}
                  </div>
                  {/* Col 3: Metrics */}
                  <div className="flex-1 overflow-y-auto">
                    {modalDash && METRICS[modalCat]?.[modalDash]?.map(m => (
                      <button key={m} onClick={() => setModalMetric(`${modalCat} / ${modalDash} / ${m}`)}
                        className={`w-full px-3 py-2 text-left transition-colors flex items-center justify-between ${modalMetric === `${modalCat} / ${modalDash} / ${m}` ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                        <span>{m}</span>
                        {modalMetric === `${modalCat} / ${modalDash} / ${m}` && <span className="text-blue-500 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
                {modalMetric && (
                  <p className="text-xs text-blue-600 mt-1">Selected: {modalMetric}</p>
                )}
              </div>

              {/* Target Threshold */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  <span className="text-red-500 mr-0.5">*</span>Target Threshold
                </label>
                <div className="flex items-center gap-6">
                  {(["Fixed Value", "Data Table"] as const).map(t => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
                      <RadioBtn checked={modalThreshold === t} onChange={() => setModalThreshold(t)} /> {t}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-1.5 rounded text-sm transition-colors">Cancel</button>
              <button onClick={confirmCriteria} disabled={!modalMetric || !modalThreshold}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </FMSLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-4 bg-red-600 rounded-sm flex-shrink-0" />
      <h2 className="text-sm font-semibold text-gray-900">{children}</h2>
    </div>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-44 flex-shrink-0 text-right pt-1.5">
        <span className="text-sm text-gray-600">
          {required && <span className="text-red-500 mr-0.5">*</span>}
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function RadioBtn({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "border-red-600" : "border-gray-400"}`}>
      {checked && <span className="w-2 h-2 rounded-full bg-red-600" />}
    </button>
  );
}

function CheckOption({ checked, onChange, title, description }: {
  checked: boolean; onChange: (v: boolean) => void; title: string; description: string;
}) {
  return (
    <label className="flex items-start gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-red-600" />
      <div>
        <p className="text-sm text-gray-800 font-medium">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </label>
  );
}
