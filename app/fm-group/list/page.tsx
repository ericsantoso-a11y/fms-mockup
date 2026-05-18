"use client";
import { useState } from "react";
import Link from "next/link";
import FMSLayout from "@/components/FMSLayout";
import { mockFMGroups } from "@/lib/mockData";

export default function FMGroupListPage() {
  const [searchName, setSearchName] = useState("");
  const [searchLead, setSearchLead] = useState("");
  const [searchMember, setSearchMember] = useState("");
  const [filtered, setFiltered] = useState(mockFMGroups);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [showSuccess, setShowSuccess] = useState(
    typeof window !== "undefined" && sessionStorage.getItem("fm_created") === "1"
  );

  if (typeof window !== "undefined" && sessionStorage.getItem("fm_created") === "1") {
    sessionStorage.removeItem("fm_created");
  }

  const handleSearch = () => {
    const result = mockFMGroups.filter((g) => {
      const nameMatch = !searchName || g.name.toLowerCase().includes(searchName.toLowerCase());
      const leadMatch = !searchLead || g.groupLead.toLowerCase().includes(searchLead.toLowerCase());
      const memberMatch =
        !searchMember ||
        g.groupMembers.some((m) => m.name.toLowerCase().includes(searchMember.toLowerCase()));
      return nameMatch && leadMatch && memberMatch;
    });
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchName("");
    setSearchLead("");
    setSearchMember("");
    setFiltered(mockFMGroups);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatMembers = (members: { id: number; name: string }[]) => {
    if (members.length === 0) return "-";
    const display = members.slice(0, 2).map((m) => `[${m.id}]${m.name}`).join(", ");
    return members.length > 2 ? `${display}...` : display;
  };

  return (
    <FMSLayout breadcrumbs={[{ label: "Workforce Management" }, { label: "FM Group" }]}>
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <span className="text-sm">FM Group created successfully.</span>
          <button onClick={() => setShowSuccess(false)} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">FM Group</label>
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Please Select"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-red-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Main Driver</label>
            <input
              value={searchLead}
              onChange={(e) => setSearchLead(e.target.value)}
              placeholder="Please Select"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-red-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Sub Driver</label>
            <input
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Please Select"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:border-red-400"
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
        {/* Action bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
          <Link
            href="/fm-group/create"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Create Group
          </Link>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">
            Log
          </button>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">
            Export
          </button>
          <div className="relative">
            <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">
              Batch Actions
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">FM Group ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">FM Group Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Group Lead</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Group Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Number of Drivers
                  <span className="ml-1 text-gray-400 cursor-help" title="Total drivers in group including lead">ⓘ</span>
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
                    <td className="px-4 py-3">
                      <Link href={`/fm-group/${group.id}/view`} className="text-blue-600 hover:underline">
                        {group.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      [{group.groupLeadId}]{group.groupLead}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatMembers(group.groupMembers)}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{group.description}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {group.groupMembers.length + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/fm-group/${group.id}/view`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/fm-group/${group.id}/edit`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600"
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${
                p === currentPage
                  ? "bg-red-600 text-white border-red-600"
                  : "border-gray-300 text-gray-600 hover:border-red-400"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600"
          >
            {">"}
          </button>
          <span className="text-sm text-gray-500">
            {pageSize} / Page
          </span>
          <span className="text-sm text-gray-500">Go to page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            defaultValue={currentPage}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = parseInt((e.target as HTMLInputElement).value);
                if (v >= 1 && v <= totalPages) setCurrentPage(v);
              }
            }}
            className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-red-400"
          />
          <button
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm"
            onClick={() => {}}
          >
            Go
          </button>
        </div>
      </div>
    </FMSLayout>
  );
}
