"use client";
import { useState } from "react";
import FMSLayout from "@/components/FMSLayout";
import Link from "next/link";

const TICKET = {
  id: "CT-00001",
  title: "Driver not showing up for pickup",
  priority: "P1",
  l1Type: "Driver Issue",
  l2Type: "No Show",
  assignedStation: "Pandan SC",
  assignedTeam: "Driver Support Team",
  assignee: "Eric Santos",
  createdTime: "2026-05-01 09:00",
  lastUpdated: "2026-05-01 09:45",
  sla: "24h",
  autoClose: "No",
  status: "Created",
  displayStatus: "Created",
  createdBy: "System",
  source: "Auto-generated",
  orderCount: 12,
  pickupPointId: "PUP-4421",
  driverId: "DRV-8821",
  driverName: "Ahmad Fauzi",
  stationCode: "PND-001",
  region: "Central",
};

const LOG_ENTRIES = [
  {
    id: 1,
    timestamp: "2026-05-01 09:45",
    actor: "Eric Santos",
    action: "Status Updated",
    before: { Status: "Created" },
    after: { Status: "In Progress" },
  },
  {
    id: 2,
    timestamp: "2026-05-01 09:30",
    actor: "System",
    action: "Assignee Changed",
    before: { Assignee: "—", Team: "—" },
    after: { Assignee: "Eric Santos", Team: "Driver Support Team" },
  },
  {
    id: 3,
    timestamp: "2026-05-01 09:00",
    actor: "System",
    action: "Ticket Created",
    before: null,
    after: {
      Priority: "P1",
      "L1 Type": "Driver Issue",
      "L2 Type": "No Show",
      Station: "Pandan SC",
    },
  },
];

const RESPOND_TEMPLATES = [
  "Driver has been contacted and confirmed attendance.",
  "Escalated to station manager for immediate action.",
  "Case is under investigation.",
];

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-5 rounded bg-red-600 flex-shrink-0" />
      <h2 className="text-sm font-semibold text-gray-800">{label}</h2>
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value ?? "—"}</p>
    </div>
  );
}

const priorityBadge = (p: string) => {
  if (p === "P1") return "bg-red-100 text-red-700 font-bold";
  if (p === "P2") return "bg-orange-100 text-orange-700 font-semibold";
  return "bg-gray-100 text-gray-600";
};

const statusBadge = (s: string) => {
  if (s === "Created") return "bg-orange-100 text-orange-700";
  if (s === "Resolved") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-500";
};

export default function WorkspaceDetail() {
  const [activeTab, setActiveTab] = useState<"respond" | "comment">("respond");
  const [responseText, setResponseText] = useState("");

  return (
    <FMSLayout
      breadcrumbs={[
        { label: "Case Management" },
        { label: "Workspace", href: "/control-tower/workspace" },
        { label: TICKET.id },
      ]}
    >
      <div className="-m-6 flex h-full min-h-0" style={{ height: "calc(100vh - 57px)" }}>
        <div className="flex-1 overflow-y-auto p-6 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Link href="/control-tower/workspace" className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-base font-bold text-gray-900">{TICKET.id}</h1>
                <p className="text-xs text-gray-500 mt-0.5">{TICKET.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs ${priorityBadge(TICKET.priority)}`}>{TICKET.priority}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${statusBadge(TICKET.displayStatus)}`}>{TICKET.displayStatus}</span>
              <button className="px-3 py-1.5 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">Show Key</button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <SectionHeader label="Basic Info" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Field label="Ticket ID" value={TICKET.id} />
              <Field label="Created By" value={TICKET.createdBy} />
              <Field label="Created Time" value={TICKET.createdTime} />
              <Field label="Last Updated" value={TICKET.lastUpdated} />
              <Field label="Priority" value={<span className={`px-2 py-0.5 rounded text-xs ${priorityBadge(TICKET.priority)}`}>{TICKET.priority}</span>} />
              <Field label="SLA" value={TICKET.sla} />
              <Field label="Auto Close" value={TICKET.autoClose} />
              <Field label="Source" value={TICKET.source} />
              <Field label="L1 Case Type" value={TICKET.l1Type} />
              <Field label="L2 Case Type" value={TICKET.l2Type} />
              <Field label="Assigned Station" value={TICKET.assignedStation} />
              <Field label="Assigned Team" value={TICKET.assignedTeam} />
              <Field label="Assignee" value={TICKET.assignee} />
              <Field label="Status" value={<span className={`px-2 py-0.5 rounded text-xs ${statusBadge(TICKET.displayStatus)}`}>{TICKET.displayStatus}</span>} />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <SectionHeader label="Input Fields Info" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Field label="Driver ID" value={TICKET.driverId} />
              <Field label="Driver Name" value={TICKET.driverName} />
              <Field label="Pickup Point ID" value={TICKET.pickupPointId} />
              <Field label="Order Count" value={TICKET.orderCount} />
              <Field label="Station Code" value={TICKET.stationCode} />
              <Field label="Region" value={TICKET.region} />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
            <SectionHeader label="Display Fields Info" />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <Field label="Assigned Station" value={TICKET.assignedStation} />
              <Field label="Assigned Team" value={TICKET.assignedTeam} />
              <Field label="Driver Status" value="Active" />
              <Field label="Last Known Location" value="Pandan, Singapore" />
              <Field label="Pickup Window" value="09:00 – 12:00" />
              <Field label="Escalation Flag" value="Yes" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <SectionHeader label="Comment / Response Info" />
            <div className="flex border-b border-gray-200 mb-4">
              {(["respond", "comment"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "respond" && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">Quick templates</p>
                  <div className="flex flex-wrap gap-2">
                    {RESPOND_TEMPLATES.map((t) => (
                      <button key={t} onClick={() => setResponseText(t)}
                        className="text-xs px-2.5 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                        {t.slice(0, 40)}…
                      </button>
                    ))}
                  </div>
                </div>
                <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={4}
                  placeholder="Type your response here…"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                <div className="flex justify-end">
                  <button className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">Submit Response</button>
                </div>
              </div>
            )}
            {activeTab === "comment" && (
              <div className="space-y-3">
                <textarea rows={4} placeholder="Add an internal comment (not visible to external parties)…"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
                <div className="flex justify-end">
                  <button className="px-4 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors">Add Comment</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col border-l border-gray-200 bg-white overflow-hidden flex-shrink-0" style={{ width: "340px" }}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">Ticket Log</h2>
            <span className="text-xs text-gray-400">{LOG_ENTRIES.length} entries</span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {LOG_ENTRIES.map((entry, idx) => (
              <div key={entry.id} className="relative">
                {idx < LOG_ENTRIES.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-0 w-px bg-gray-200" style={{ transform: "translateX(-50%)" }} />
                )}
                <div className="flex gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600 flex-shrink-0 mt-0.5 z-10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{entry.action}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{entry.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">by {entry.actor}</p>
                    <div className="space-y-1.5">
                      {entry.before && (
                        <div className="bg-red-50 rounded px-2.5 py-2">
                          <p className="text-xs font-medium text-red-600 mb-1">Before</p>
                          {Object.entries(entry.before).map(([k, v]) => (
                            <p key={k} className="text-xs text-gray-700"><span className="text-gray-500">{k}:</span> {v}</p>
                          ))}
                        </div>
                      )}
                      {entry.after && (
                        <div className="bg-green-50 rounded px-2.5 py-2">
                          <p className="text-xs font-medium text-green-600 mb-1">After</p>
                          {Object.entries(entry.after).map(([k, v]) => (
                            <p key={k} className="text-xs text-gray-700"><span className="text-gray-500">{k}:</span> {v}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-gray-100">
            <button onClick={() => setActiveTab("comment")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </FMSLayout>
  );
}
