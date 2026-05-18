"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";
import { mockPendingSellers } from "@/lib/mockAssignData";
import { mockDriverOptions } from "@/lib/mockData";

type Timeslot = "Today" | "Backlog";

export default function AssignDriverPage() {
  const router = useRouter();

  // Filters
  const [postCode, setPostCode] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [pupGroupType, setPupGroupType] = useState("");
  const [pupId, setPupId] = useState("");
  const [shopSpId, setShopSpId] = useState("");
  const [timeslots, setTimeslots] = useState<Timeslot[]>(["Today", "Backlog"]);
  const [cutoffDate, setCutoffDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [status, setStatus] = useState("Created");
  const [pupType, setPupType] = useState("");
  const [sellerTag, setSellerTag] = useState("");
  const [sortBy, setSortBy] = useState("oldest");

  const [filtered, setFiltered] = useState(mockPendingSellers);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(false);
  const pageSize = 24;

  const removeTimeslot = (t: Timeslot) => setTimeslots((prev) => prev.filter((x) => x !== t));
  const addTimeslot = (t: Timeslot) => {
    if (!timeslots.includes(t)) setTimeslots((prev) => [...prev, t]);
  };

  const handleSearch = () => {
    let result = mockPendingSellers.filter((r) => {
      const pcMatch = !postCode || r.postCode.includes(postCode);
      const stMatch = !serviceType || r.serviceType === serviceType;
      const ptMatch = !pupType || r.pupType === pupType;
      const idMatch = !pupId || r.pickupPointId.toLowerCase().includes(pupId.toLowerCase());
      const shopMatch = !shopSpId || r.shopSpIds.toLowerCase().includes(shopSpId.toLowerCase());
      return pcMatch && stMatch && ptMatch && idMatch && shopMatch;
    });
    if (sortBy === "oldest") result = result.slice().reverse();
    setFiltered(result);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleReset = () => {
    setPostCode(""); setServiceType(""); setPupGroupType(""); setPupId("");
    setShopSpId(""); setTimeslots(["Today", "Backlog"]); setCutoffDate("");
    setPreferredTime(""); setStatus("Created"); setPupType(""); setSellerTag("");
    setFiltered(mockPendingSellers);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pageIds = paged.map((r) => r.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  const toggleRow = (id: number) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelectedIds(allPageSelected
      ? selectedIds.filter((id) => !pageIds.includes(id))
      : [...new Set([...selectedIds, ...pageIds])]
    );

  const handleAssignConfirm = () => {
    setShowAssignModal(false);
    setAssignSuccess(true);
    setSelectedIds([]);
    setSelectedDriver("");
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  const pupTypeBadge: Record<string, string> = {
    NS: "bg-blue-50 text-blue-600 border border-blue-200",
    SP: "bg-purple-50 text-purple-600 border border-purple-200",
    Seller: "bg-orange-50 text-orange-600 border border-orange-200",
    DOP: "bg-teal-50 text-teal-600 border border-teal-200",
  };

  return (
    <FMSLayout breadcrumbs={[
      { label: "Pickup" },
      { label: "Pickup Assignment", href: "/station/pickup-assignment" },
      { label: "Assign Driver" },
    ]}>
      {assignSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <span className="text-sm">Driver assigned successfully to {selectedIds.length === 0 ? "selected" : ""} pickups.</span>
          <button onClick={() => setAssignSuccess(false)} className="text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4 space-y-3">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Post Code</label>
            <input value={postCode} onChange={(e) => setPostCode(e.target.value)} placeholder="Please Select" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Service Type</label>
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option>Standard</option>
              <option>Sameday</option>
              <option>Express</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">PUP Group Type</label>
            <select value={pupGroupType} onChange={(e) => setPupGroupType(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option>Pickup Group</option>
              <option>Unknown Group</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">PUP ID</label>
            <input value={pupId} onChange={(e) => setPupId(e.target.value)} placeholder="Please Input" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-red-400" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Shop/SP ID</label>
            <input value={shopSpId} onChange={(e) => setShopSpId(e.target.value)} placeholder="Please Input" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Pickup Timeslot</label>
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 min-w-44 gap-1 flex-wrap bg-white">
              {timeslots.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                  {t}
                  <button onClick={() => removeTimeslot(t)} className="text-gray-400 hover:text-gray-600 leading-none">×</button>
                </span>
              ))}
              <select
                className="text-xs border-none outline-none bg-transparent text-gray-400 cursor-pointer ml-1"
                value=""
                onChange={(e) => { if (e.target.value) addTimeslot(e.target.value as Timeslot); }}
              >
                <option value=""></option>
                {(["Today", "Backlog"] as Timeslot[]).filter((t) => !timeslots.includes(t)).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Create Cutoff Time</label>
            <input type="date" value={cutoffDate} onChange={(e) => setCutoffDate(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Preferred Pickup Time</label>
            <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option>Morning (8am-12pm)</option>
              <option>Afternoon (12pm-6pm)</option>
              <option>Evening (6pm-10pm)</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="Created">Created</option>
              <option value="Assigned">Assigned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">PUP Type</label>
            <select value={pupType} onChange={(e) => setPupType(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option value="NS">NS</option>
              <option value="SP">SP</option>
              <option value="Seller">Seller</option>
              <option value="DOP">DOP</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Seller/PUP tag</label>
            <select value={sellerTag} onChange={(e) => setSellerTag(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-36 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option value="SP">SP</option>
              <option value="Seller">Seller</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
            <button onClick={handleReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
          </div>
        </div>
      </div>

      {/* Sort bar */}
      <div className="flex items-center mb-3">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-red-400">
          <option value="oldest">Sort by Oldest Orders</option>
          <option value="newest">Sort by Newest Orders</option>
          <option value="postcode">Sort by Post Code</option>
        </select>
      </div>

      {/* Selection bar */}
      <div className="bg-white rounded border border-gray-200 mb-3 px-4 py-2.5 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          <span className="font-semibold text-red-600">{selectedIds.length}</span> Shop(s)/DOP(s) Selected
        </span>
        <button
          onClick={() => selectedIds.length > 0 && setShowAssignModal(true)}
          className={`px-5 py-1.5 rounded text-sm font-medium transition-colors ${
            selectedIds.length > 0
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-red-200 text-white cursor-not-allowed"
          }`}
        >
          Assign
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate" }}>
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs">
                <th className="px-3 py-3 w-10">
                  <div className="flex items-center gap-1">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="accent-red-600" />
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </th>
                {["Pickup Point ID","Shop/SP IDs","Shop/SP Names","Shop/SP Address","PUP Type","Service Type","Manual PUPG","Mapped PUPG","Post Code","Seller/PUP tag","Preferred Pickup Time","ETA","Action"].map((h) => (
                  <th key={h} className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 text-xs ${selectedIds.includes(row.id) ? "bg-red-50" : ""}`}
                >
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleRow(row.id)} className="accent-red-600" />
                  </td>
                  <td className="px-3 py-3 text-gray-700 font-mono">{row.pickupPointId}</td>
                  <td className="px-3 py-3 text-gray-700">{row.shopSpIds}</td>
                  <td className="px-3 py-3 text-gray-700 max-w-32 truncate" title={row.shopSpNames}>{row.shopSpNames}</td>
                  <td className="px-3 py-3 text-gray-600 max-w-40" title={row.shopSpAddress}>
                    <span className="line-clamp-2">{row.shopSpAddress}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${pupTypeBadge[row.pupType]}`}>{row.pupType}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{row.serviceType}</td>
                  <td className="px-3 py-3 text-gray-500">{row.manualPUPG}</td>
                  <td className="px-3 py-3 text-gray-500">{row.mappedPUPG}</td>
                  <td className="px-3 py-3 text-gray-700">{row.postCode}</td>
                  <td className="px-3 py-3 text-gray-500">{row.sellerPupTag}</td>
                  <td className="px-3 py-3 text-gray-500">{row.preferredPickupTime}</td>
                  <td className="px-3 py-3 text-gray-500">{row.eta}</td>
                  <td className="px-3 py-3">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Total: {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{"<"}</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${p === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{p}</button>
            ))}
            {totalPages > 5 && <><span className="text-gray-400">...</span><button onClick={() => setCurrentPage(totalPages)} className="w-7 h-7 flex items-center justify-center rounded text-sm border border-gray-300 text-gray-600 hover:border-red-400">{totalPages}</button></>}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{">"}</button>
            <span className="text-sm text-gray-500 ml-2">{pageSize} / Page</span>
          </div>
        </div>
      </div>

      {/* Assign confirmation modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Assign Driver</h3>
            <p className="text-sm text-gray-500 mb-4">
              Assigning <span className="font-semibold text-gray-700">{selectedIds.length}</span> Shop(s)/DOP(s) to a driver
            </p>
            <label className="block text-sm text-gray-700 mb-1">Select Driver <span className="text-red-500">*</span></label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-red-400 mb-5"
            >
              <option value="">Please Select</option>
              {mockDriverOptions.slice(0, 8).map((d) => (
                <option key={d.id} value={String(d.id)}>[{d.id}] {d.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded text-sm">Cancel</button>
              <button
                onClick={handleAssignConfirm}
                disabled={!selectedDriver}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </FMSLayout>
  );
}
