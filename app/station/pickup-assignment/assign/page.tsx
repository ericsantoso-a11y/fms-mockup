"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";
import { mockPendingSellers } from "@/lib/mockAssignData";
import { mockDriverOptions, mockStationOptions, mockPickupGroups } from "@/lib/mockData";

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
  const [assignSuccess, setAssignSuccess] = useState(false);

  interface DriverRow { rowId: number; driverId: string; stationId: string; }
  const [driverRows, setDriverRows] = useState<DriverRow[]>([{ rowId: 1, driverId: "", stationId: "9197" }]);
  const [nextRowId, setNextRowId] = useState(2);
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

  const addDriverRow = () => {
    setDriverRows((prev) => [...prev, { rowId: nextRowId, driverId: "", stationId: "9197" }]);
    setNextRowId((n) => n + 1);
  };
  const removeDriverRow = (rowId: number) =>
    setDriverRows((prev) => prev.length > 1 ? prev.filter((r) => r.rowId !== rowId) : prev);
  const updateDriverRow = (rowId: number, field: "driverId" | "stationId", value: string) =>
    setDriverRows((prev) => prev.map((r) => r.rowId === rowId ? { ...r, [field]: value } : r));

  const selectedRows = filtered.filter((r) => selectedIds.includes(r.id));
  const totalPickupPoints = new Set(selectedRows.map((r) => r.pickupPointId)).size;
  const totalOrders = selectedRows.reduce((s, r) => s + r.orderCount, 0);
  const totalWeight = selectedRows.reduce((s, r) => s + r.totalWeightKg, 0);
  const totalVolume = selectedRows.reduce((s, r) => s + r.totalVolumeCm3, 0);

  const handleAssignConfirm = () => {
    setShowAssignModal(false);
    setAssignSuccess(true);
    setSelectedIds([]);
    setDriverRows([{ rowId: 1, driverId: "", stationId: "9197" }]);
    setNextRowId(2);
    setTimeout(() => setAssignSuccess(false), 3000);
  };

  const canConfirm = driverRows.every((r) => r.driverId !== "");

  const groupLeadMap = new Map(mockPickupGroups.map((g) => [g.groupLeadId, g.name]));

  const formatDriverLabel = (d: typeof mockDriverOptions[0]) => {
    const isPandan = d.hub === "Pandan Sorting Centre";
    const hubPart = isPandan ? "" : ` (${d.hub})`;
    const groupName = groupLeadMap.get(d.id);
    const groupPart = groupName ? ` — Group: ${groupName}` : "";
    return `[${d.id}] ${d.name}${hubPart}${groupPart}`;
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
      {/* Simulation tip */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-4 py-2.5 mb-4 text-sm text-blue-700">
        <svg className="w-4 h-4 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Select at least one PUP from the table below, then click <strong>Assign</strong> to open the driver assignment panel and experience the improved Group Lead identification.</span>
      </div>

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

      {/* Assign Driver modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-800">Assign Driver</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 space-y-5">
              {/* Pending Assign Orders stats */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Pending Assign Orders</p>
                <div className="relative border border-gray-200 rounded">
                  <div className="overflow-x-auto">
                    <div className="flex items-center gap-8 px-4 py-3 text-sm whitespace-nowrap min-w-max">
                      <span className="text-gray-600">Total Pickup Point: <span className="font-semibold text-gray-800">{totalPickupPoints}</span></span>
                      <span className="text-gray-600">Total Order: <span className="font-semibold text-gray-800">{totalOrders}</span></span>
                      <span className="text-gray-600">Total Order Weight(kg): <span className="font-semibold text-gray-800">{totalWeight.toFixed(3)}</span></span>
                      <span className="text-gray-600">Total Order Volume(cm³): <span className="font-semibold text-gray-800">{totalVolume}</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver section */}
              <div>
                <p className="text-sm font-medium text-gray-800 mb-3">
                  <span className="text-red-500 mr-1">*</span>Driver
                </p>

                {/* Capacity bars */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Weight Capacity", tooltip: "Used weight / Vehicle weight capacity", value: `${totalWeight.toFixed(3)}/-` },
                    { label: "Volume Capacity", tooltip: "Used volume / Vehicle volume capacity", value: `${totalVolume}/-` },
                    { label: "Order Capacity", tooltip: "Order Capacity = Assigned Orders / Vehicle Order Capacity", value: `${totalOrders}/-` },
                  ].map(({ label, tooltip, value }) => (
                    <div key={label} className="relative group">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-gray-500">{label}</span>
                        <div className="relative inline-block">
                          <svg className="w-3.5 h-3.5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded px-2 py-1.5 opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-normal text-center">
                            {tooltip}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: "30%" }} />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Driver rows table */}
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">Driver</th>
                        <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">
                          <span className="flex items-center gap-1">
                            Handover Station
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </th>
                        <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverRows.map((row) => (
                        <tr key={row.rowId} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-2.5">
                            <select
                              value={row.driverId}
                              onChange={(e) => updateDriverRow(row.rowId, "driverId", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-red-400"
                            >
                              <option value="">Please Select</option>
                              {mockDriverOptions.map((d) => (
                                <option key={d.id} value={String(d.id)}>
                                  {formatDriverLabel(d)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <select
                              value={row.stationId}
                              onChange={(e) => updateDriverRow(row.rowId, "stationId", e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-red-400"
                            >
                              {mockStationOptions.map((s) => (
                                <option key={s.id} value={String(s.id)}>[{s.id}] {s.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-3 py-2.5">
                            <button
                              onClick={() => removeDriverRow(row.rowId)}
                              disabled={driverRows.length === 1}
                              className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={addDriverRow}
                  className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Driver
                </button>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowAssignModal(false)}
                className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-5 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignConfirm}
                disabled={!canConfirm}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded text-sm font-medium"
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
