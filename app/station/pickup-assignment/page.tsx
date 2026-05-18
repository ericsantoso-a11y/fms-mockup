"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import FMSLayout from "@/components/FMSLayout";
import { mockPickupAssignments, PickupStatus } from "@/lib/mockStationData";

const STATUS_STYLE: Record<PickupStatus, string> = {
  Created: "bg-blue-50 text-blue-600 border border-blue-200",
  Assigned: "bg-green-50 text-green-600 border border-green-200",
  Completed: "bg-gray-100 text-gray-600 border border-gray-200",
  Canceled: "bg-orange-50 text-orange-500 border border-orange-200",
  Failed: "bg-red-50 text-red-500 border border-red-200",
};

export default function PickupAssignmentPage() {
  const router = useRouter();
  const [trackingNo, setTrackingNo] = useState("");
  const [pickupPointId, setPickupPointId] = useState("");
  const [shopId, setShopId] = useState("");
  const [status, setStatus] = useState("");
  const [filtered, setFiltered] = useState(mockPickupAssignments);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const created = filtered.filter((r) => r.status === "Created").length;
  const assigned = filtered.filter((r) => r.status === "Assigned").length;

  const handleSearch = () => {
    const result = mockPickupAssignments.filter((r) => {
      const tnMatch = !trackingNo || r.trackingNumber.toLowerCase().includes(trackingNo.toLowerCase());
      const ppMatch = !pickupPointId || r.pickupPointId.toLowerCase().includes(pickupPointId.toLowerCase());
      const shopMatch = !shopId || r.sellerName.toLowerCase().includes(shopId.toLowerCase());
      const statusMatch = !status || r.status === status;
      return tnMatch && ppMatch && shopMatch && statusMatch;
    });
    setFiltered(result);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setTrackingNo(""); setPickupPointId(""); setShopId(""); setStatus("");
    setFiltered(mockPickupAssignments);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <FMSLayout breadcrumbs={[{ label: "Pickup" }, { label: "Pickup Assignment" }]}>
      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-4 space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">SPX Tracking Number</label>
            <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Please Input" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Pickup Point ID</label>
            <input value={pickupPointId} onChange={(e) => setPickupPointId(e.target.value)} placeholder="Please Input" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Pickup Point Name</label>
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option>Pandan Sorting Centre</option>
              <option>Jurong Hub</option>
              <option>Tampines Hub</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Shop/SP ID</label>
            <input value={shopId} onChange={(e) => setShopId(e.target.value)} placeholder="Please Input" className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 focus:outline-none focus:border-red-400" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Seller&apos;s Fault Times</label>
            <div className="flex items-center gap-1">
              <input type="number" placeholder="—" className="border border-gray-300 rounded px-2 py-1.5 text-sm w-16 text-center focus:outline-none focus:border-red-400" />
              <span className="text-gray-400">—</span>
              <input type="number" placeholder="—" className="border border-gray-300 rounded px-2 py-1.5 text-sm w-16 text-center focus:outline-none focus:border-red-400" />
              <button className="border border-gray-300 rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 text-sm">+</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Pickup Date</label>
            <div className="flex items-center gap-1">
              <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-red-400" />
              <span className="text-gray-400">—</span>
              <input type="date" className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Create Time</label>
            <div className="flex items-center gap-1">
              <input type="datetime-local" defaultValue="2026-02-18T17:41" className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-red-400" />
              <span className="text-gray-400">—</span>
              <input type="datetime-local" defaultValue="2026-05-18T17:41" className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm w-44 bg-white focus:outline-none focus:border-red-400">
              <option value="">Please Select</option>
              <option value="Created">Created</option>
              <option value="Assigned">Assigned</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={handleSearch} className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">Search</button>
            <button onClick={handleReset} className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm transition-colors">Reset</button>
          </div>
        </div>
      </div>

      {/* Stats + actions bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">Created: <span className="font-semibold text-blue-600">{created}</span></span>
          <span className="text-gray-600">Assigned: <span className="font-semibold text-red-600">{assigned}</span></span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/station/pickup-assignment/assign")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Assign Driver
          </button>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm flex items-center gap-1">
            Export
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table — read only, no checkboxes */}
      <div className="bg-white rounded border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">SPX Tracking Number</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Pickup Point ID</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Pickup Point Name</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Seller/SP Name</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Seller/SP Phone</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Seller/SP District</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Order Account</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">Pickup Attempts</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">ETA</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-3 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-700 font-mono text-xs">{row.trackingNumber}</td>
                  <td className="px-3 py-3 text-gray-700 text-xs">{row.pickupPointId}</td>
                  <td className="px-3 py-3 text-gray-700">{row.pickupPointName}</td>
                  <td className="px-3 py-3 text-gray-700">{row.sellerName}</td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-1 text-gray-700">
                      <span className="font-mono text-xs">****{row.sellerPhone.slice(-4)}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-1 text-gray-700">
                      <span className="font-mono text-xs">****</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700 text-xs">{row.orderAccount}</td>
                  <td className="px-3 py-3 text-gray-700 text-center">{row.pickupAttempts}</td>
                  <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap">{row.eta}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_STYLE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Total: {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{"<"}</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 h-7 flex items-center justify-center rounded text-sm border transition-colors ${p === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"}`}>{p}</button>
            ))}
            {totalPages > 5 && <span className="text-gray-400">...</span>}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600">{">"}</button>
            <span className="text-sm text-gray-500 ml-2">{pageSize} / Page</span>
          </div>
        </div>
      </div>
    </FMSLayout>
  );
}
