"use client";
import { useState } from "react";
import Link from "next/link";
import FMSLayout from "@/components/FMSLayout";
import FuzzySearch from "@/components/FuzzySearch";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";
import { mockPickupGroups, mockDriverOptions } from "@/lib/mockData";

const ADMIN_CHANGES = [
  {
    title: "New Pickup Group Module",
    description:
      "A dedicated Pickup Group module has been introduced under Workforce Management. Operations managers can now create and manage Pickup Groups, designate a Group Lead (Main Driver), and assign Team Members — enabling structured, group-based fleet coordination directly from the FMS portal.",
  },
  {
    title: "Group Lead & Member Configuration",
    description:
      "Each Pickup Group has a clearly defined Group Lead responsible for the primary task list, and one or more Team Members who operate under the same group. Leads and members can be reassigned at any time without affecting existing task allocation.",
  },
];

export default function PickupGroupListPage() {
  const [filterGroupText, setFilterGroupText] = useState("");
  const [filterGroupId, setFilterGroupId] = useState<number | null>(null);
  const [filterLeadText, setFilterLeadText] = useState("");
  const [filterLeadId, setFilterLeadId] = useState<number | null>(null);
  const [filterMemberText, setFilterMemberText] = useState("");
  const [filterMemberId, setFilterMemberId] = useState<number | null>(null);

  const [filtered, setFiltered] = useState(mockPickupGroups);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [groups, setGroups] = useState(mockPickupGroups);

  const [showSuccess, setShowSuccess] = useState(
    typeof window !== "undefined" && sessionStorage.getItem("pickup_created") === "1"
  );
  if (typeof window !== "undefined" && sessionStorage.getItem("pickup_created") === "1") {
    sessionStorage.removeItem("pickup_created");
  }

  // Options for fuzzy search
  const groupOptions = groups.map((g) => ({ id: g.id, name: g.name }));
  const leadOptions = Array.from(
    new Map(groups.map((g) => [g.groupLeadId, { id: g.groupLeadId, name: g.groupLead }])).values()
  );
  const memberOptions = Array.from(
    new Map(groups.flatMap((g) => g.groupMembers).map((m) => [m.id, m])).values()
  );

  const handleSearch = () => {
    const result = groups.filter((g) => {
      const groupMatch = !filterGroupId || g.id === filterGroupId;
      const leadMatch = !filterLeadId || g.groupLeadId === filterLeadId;
      const memberMatch = !filterMemberId || g.groupMembers.some((m) => m.id === filterMemberId);
      return groupMatch && leadMatch && memberMatch;
    });
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterGroupText(""); setFilterGroupId(null);
    setFilterLeadText(""); setFilterLeadId(null);
    setFilterMemberText(""); setFilterMemberId(null);
    setFiltered(groups);
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    const updated = groups.filter((g) => g.id !== id);
    setGroups(updated);
    setFiltered(updated);
    setDeleteTarget(null);
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatMembers = (members: { id: number; name: string }[]) => {
    if (members.length === 0) return "-";
    const display = members.slice(0, 2).map((m) => `[${m.id}]${m.name}`).join(", ");
    return members.length > 2 ? `${display}...` : display;
  };

  return (
    <FMSLayout breadcrumbs={[{ label: "Workforce Management" }, { label: "Pickup Group" }]}>
      <FloatingWhatsNew module="Admin — Pickup Group" changes={ADMIN_CHANGES} />
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <span className="text-sm">Pickup Group created successfully.</span>
          <button onClick={() => setShowSuccess(false)} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Pickup Group</label>
            <FuzzySearch
              options={groupOptions}
              value={filterGroupText}
              onSelect={(text, id) => { setFilterGroupText(text); setFilterGroupId(id); }}
              placeholder="Please Select"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Main Driver</label>
            <FuzzySearch
              options={leadOptions}
              value={filterLeadText}
              onSelect={(text, id) => { setFilterLeadText(text); setFilterLeadId(id); }}
              placeholder="Please Select"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Sub Driver</label>
            <FuzzySearch
              options={memberOptions}
              value={filterMemberText}
              onSelect={(text, id) => { setFilterMemberText(text); setFilterMemberId(id); }}
              placeholder="Please Select"
            />
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded border border-gray-200">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Link href="/pickup-group/create" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
            Create Group
          </Link>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Log</button>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Export</button>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">
            Batch Actions
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate" }}>
            <thead className="relative" style={{ overflow: "visible" }}>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pickup Group ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Pickup Group Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  <div className="flex items-center gap-1.5">
                    Group Lead
                    <Tooltip text="Assignment will be performed to the group lead. All group members will receive the assignment." />
                  </div>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Group Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Number of Drivers
                  <span className="ml-1 text-gray-400 cursor-help" title="Total drivers including group lead">ⓘ</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">No data found</td>
                </tr>
              ) : (
                paged.map((group) => (
                  <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{group.id}</td>
                    <td className="px-4 py-3 text-gray-700">{group.name}</td>
                    <td className="px-4 py-3 text-gray-700">[{group.groupLeadId}]{group.groupLead}</td>
                    <td className="px-4 py-3 text-gray-700">{formatMembers(group.groupMembers)}</td>
                    <td className="px-4 py-3 text-gray-500">{group.description}</td>
                    <td className="px-4 py-3 text-gray-700">{group.groupMembers.length + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/pickup-group/${group.id}/view`} className="text-blue-600 hover:underline text-sm">View</Link>
                        <Link href={`/pickup-group/${group.id}/edit`} className="text-blue-600 hover:underline text-sm">Edit</Link>
                        <button onClick={() => setDeleteTarget(group.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{"<"}</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${p === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{p}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{">"}</button>
          <span className="text-sm text-gray-500">{pageSize} / Page</span>
          <span className="text-sm text-gray-500">Go to page</span>
          <input type="number" min={1} max={totalPages} defaultValue={1} onKeyDown={(e) => { if (e.key === "Enter") { const v = parseInt((e.target as HTMLInputElement).value); if (v >= 1 && v <= totalPages) setCurrentPage(v); }}} className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-red-400" />
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm">Go</button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Delete Pickup Group</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <strong>{groups.find((g) => g.id === deleteTarget)?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </FMSLayout>
  );
}

function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs font-bold hover:border-gray-600 hover:text-gray-600 flex-shrink-0"
      >
        ?
      </button>
      {visible && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-gray-800 text-white text-xs rounded px-3 py-2 shadow-lg z-50 leading-relaxed pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800" />
          {text}
        </div>
      )}
    </div>
  );
}
