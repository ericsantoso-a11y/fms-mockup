"use client";
import { useState, useEffect } from "react";
import FMSLayout from "@/components/FMSLayout";
import FloatingWhatsNew from "@/components/FloatingWhatsNew";

const CT_CHANGES = [
  {
    title: "Rule configuration moved to CT Configuration",
    description: "The rule configuration mechanism has been removed from this dashboard and relocated to Control Tower Configuration for centralized management.",
  },
  {
    title: "Highlights driven by Control Tower",
    description: "This module now shows only PUPs flagged by Control Tower, surfacing the priority level (P1/P2) and the specific issue (e.g. Forget to assign, Risk of mispickup, Driver idling).",
  },
];

type PTStatus = "Pickup Start" | "Pickup Done" | "Accepted" | "Assigned" | "-";
type CasePriority = "P1" | "P2" | "-";

interface Row {
  id: number;
  shopSvp: string;
  shopId: string;
  pupId: string;
  type: "Seller" | "SVP";
  pupGroup: string;
  zoneId: string;
  sellerPupTag: string;
  caseTicket: string;
  casePriority: CasePriority;
  csTicket: string;
  csTicketCreateTime: string;
  pendingPickup: number | null;
  notAssignedToday: number | null;
  pendingPickupSpx: number | null;
  totalPicked: number | null;
  commonLastPickupHour: string;
  ifPickedYesterday: string;
  latestAttemptTime: string;
  latestPtStatus: PTStatus;
  latestOnHoldReason: string;
  driver: string;
  driverLastActive: string;
}

const BASE: Row[] = [
  { id: 1, shopSvp: "National Book Store Customer Service...", shopId: "75450137", pupId: "PUP202510301KOZX", type: "Seller", pupGroup: "FM DTS Cluster 3", zoneId: "-", sellerPupTag: "-", caseTicket: "Forget to assign", casePriority: "P1", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 3121, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 282, commonLastPickupHour: "21:00", ifPickedYesterday: "Yes", latestAttemptTime: "17:20", latestPtStatus: "Pickup Start", latestOnHoldReason: "-", driver: "John Mark Apaap Concepcion", driverLastActive: "17:20" },
  { id: 2, shopSvp: "SNAKE", shopId: "868404707", pupId: "PUP202412160TNA5", type: "Seller", pupGroup: "DMT_03", zoneId: "-", sellerPupTag: "-", caseTicket: "-", casePriority: "-", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1664, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 337, commonLastPickupHour: "18:00", ifPickedYesterday: "Yes", latestAttemptTime: "15:59", latestPtStatus: "Pickup Done", latestOnHoldReason: "-", driver: "jeffrey Peralta", driverLastActive: "17:16" },
  { id: 3, shopSvp: "HealthyOrganic PH", shopId: "290729505", pupId: "PUP2025022006F35", type: "Seller", pupGroup: "DTS Cluster 3", zoneId: "-", sellerPupTag: "-", caseTicket: "Driver idling", casePriority: "P2", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1343, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 0, commonLastPickupHour: "19:00", ifPickedYesterday: "Yes", latestAttemptTime: "-", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Rolando Soriño Galeza", driverLastActive: "-" },
  { id: 4, shopSvp: "Absidy Beauty", shopId: "1095978517", pupId: "PUP202408240E0BK", type: "Seller", pupGroup: "C3_NORM_A2_Z9_MQC_10", zoneId: "-", sellerPupTag: "-", caseTicket: "Risk of mispickup", casePriority: "P1", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1327, notAssignedToday: 0, pendingPickupSpx: 1, totalPicked: 0, commonLastPickupHour: "19:00", ifPickedYesterday: "Yes", latestAttemptTime: "-", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Christian Barbero Acuyong", driverLastActive: "-" },
  { id: 5, shopSvp: "Akari Lighting & Technology Corp.", shopId: "29256376", pupId: "PUP202201260286E", type: "Seller", pupGroup: "C3_NORM_A1_Z1_LQC_1", zoneId: "-", sellerPupTag: "-", caseTicket: "-", casePriority: "-", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1163, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 0, commonLastPickupHour: "19:00", ifPickedYesterday: "Yes", latestAttemptTime: "-", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Michael Angelo Soan Roa", driverLastActive: "-" },
  { id: 6, shopSvp: "SPX Service Point - Linna Parcel...", shopId: "DOP3356", pupId: "PUP202602250DHA5", type: "SVP", pupGroup: "-", zoneId: "-", sellerPupTag: "-", caseTicket: "Forget to assign", casePriority: "P1", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1141, notAssignedToday: null, pendingPickupSpx: null, totalPicked: 2668, commonLastPickupHour: "-", ifPickedYesterday: "Yes", latestAttemptTime: "17:12", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Angelito Vitug Manuel", driverLastActive: "17:29" },
  { id: 7, shopSvp: "Alberto Shoes Corporation", shopId: "88199607", pupId: "PUP202511071MSMD", type: "Seller", pupGroup: "FM DTS Cluster 3", zoneId: "-", sellerPupTag: "-", caseTicket: "-", casePriority: "-", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 1028, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 288, commonLastPickupHour: "19:00", ifPickedYesterday: "Yes", latestAttemptTime: "15:23", latestPtStatus: "-", latestOnHoldReason: "-", driver: "Rudolf Medina De Lara", driverLastActive: "17:02" },
  { id: 8, shopSvp: "SPX Service Point - Dropdoc Express Co.", shopId: "DOP3032", pupId: "PUP202510241JHLO", type: "SVP", pupGroup: "DOP", zoneId: "-", sellerPupTag: "-", caseTicket: "Driver idling", casePriority: "P2", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 838, notAssignedToday: null, pendingPickupSpx: null, totalPicked: 432, commonLastPickupHour: "-", ifPickedYesterday: "Yes", latestAttemptTime: "15:59", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Jhon Mark Villejo Guardiana", driverLastActive: "16:53" },
  { id: 9, shopSvp: "Golden ABC", shopId: "61672248", pupId: "PUP2022022403UCI", type: "Seller", pupGroup: "C3_NORM_A1_Z5_LQC_6", zoneId: "-", sellerPupTag: "-", caseTicket: "-", casePriority: "-", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 791, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 729, commonLastPickupHour: "18:00", ifPickedYesterday: "Yes", latestAttemptTime: "17:30", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Anton Joseph Abanilla Lupas", driverLastActive: "17:30" },
  { id: 10, shopSvp: "Pet Corner Retiro", shopId: "16511247", pupId: "PUP2022021002UIN", type: "Seller", pupGroup: "C3_NORM_A1_Z1_LQC_4", zoneId: "-", sellerPupTag: "-", caseTicket: "Risk of mispickup", casePriority: "P1", csTicket: "-", csTicketCreateTime: "-", pendingPickup: 683, notAssignedToday: 0, pendingPickupSpx: 0, totalPicked: 434, commonLastPickupHour: "20:00", ifPickedYesterday: "Yes", latestAttemptTime: "13:52", latestPtStatus: "Accepted", latestOnHoldReason: "-", driver: "Fritz Joie Lora Faller", driverLastActive: "-" },
];

const SHOPS = [
  "Shein Philippines", "Kimstore", "Bench Online", "Decathlon PH", "SM Store Online",
  "Penshoppe Official", "H&M Philippines", "Zara PH Official", "Tech Zone Gadgets",
  "Memebox PH", "Uniqlo Philippines", "Forever 21 PH", "Nike PH Official", "Adidas PH",
  "Reebok Philippines", "Puma PH Store", "Converse Philippines", "Vans PH Official",
  "Carlo Rino Philippines", "Parfums de Marly PH", "Crocs Philippines",
  "Havaianas PH", "Skechers Philippines", "New Balance PH",
  "Guess Philippines", "Tommy Hilfiger PH", "Levi's Philippines", "Gap PH",
  "Old Navy PH", "Calvin Klein PH",
];
const DRIVERS = [
  "Mark David Santos", "Jose Miguel Cruz", "Paolo Reyes Dela Cruz", "Andres Miguel Bautista",
  "Roberto Lim Jr.", "Maria Santos Garcia", "Juan Carlos Mendoza", "Anne Marie Villanueva",
  "Fernando Aquino III", "Ryan Castillo Torres", "Karen Dizon Reyes", "Eduardo Marcos",
  "Lito Flores Castillo", "Agnes Soriano", "Bernardo Cruz Jr.", "Luz Perez Ramos",
  "Rey Tamayo", "Cristina Luna", "Dennis Pangilinan", "Vivian Aquino",
  "Neil Diaz Santos", "Gloria Hernandez", "Arturo Reyes", "Estrella Gomez",
  "Rodrigo Castro", "Melinda Tan", "Vicente Navarro", "Patricia De Leon",
  "Ernesto Bautista", "Conchita Villanueva",
];
const GROUPS = [
  "FM DTS Cluster 1", "FM DTS Cluster 2", "FM DTS Cluster 3", "FM DTS Cluster 4",
  "DTS Cluster 1", "DTS Cluster 2", "DTS Cluster 3",
  "C3_NORM_A1_Z1_LQC_1", "C3_NORM_A1_Z2_LQC_2", "C3_NORM_A1_Z3_LQC_3",
  "C3_NORM_A2_Z8_MQC_8", "C3_NORM_A2_Z9_MQC_10", "DMT_03", "DOP",
];
const PT_STATUSES: PTStatus[] = ["Accepted", "Accepted", "Accepted", "Pickup Done", "Pickup Start", "Assigned", "-"];
const CASE_TICKETS: { label: string; priority: CasePriority }[] = [
  { label: "Forget to assign", priority: "P1" },
  { label: "Risk of mispickup", priority: "P1" },
  { label: "Driver idling", priority: "P2" },
];

const generated: Row[] = Array.from({ length: 90 }, (_, i) => {
  const isSvp = i % 7 === 0;
  const pendingNum = Math.max(50, 650 - i * 6);
  const hasCaseTicket = i % 5 === 0;
  const ct = hasCaseTicket ? CASE_TICKETS[i % CASE_TICKETS.length] : null;
  return {
    id: 11 + i,
    shopSvp: isSvp ? `SPX Service Point - Hub ${i + 1}` : SHOPS[i % SHOPS.length],
    shopId: isSvp ? `DOP${1000 + i}` : `${20000000 + i * 1237}`,
    pupId: `PUP20240${String(i).padStart(6, "0")}`,
    type: isSvp ? "SVP" : "Seller",
    pupGroup: isSvp ? "DOP" : GROUPS[i % GROUPS.length],
    zoneId: i % 5 === 0 ? `Z${(i % 9) + 1}` : "-",
    sellerPupTag: "-",
    caseTicket: ct ? ct.label : "-",
    casePriority: ct ? ct.priority : "-",
    csTicket: i % 11 === 0 ? `CS-2024-${String(i).padStart(3, "0")}` : "-",
    csTicketCreateTime: i % 11 === 0 ? `${13 + (i % 5)}:${String((i * 7) % 60).padStart(2, "0")}` : "-",
    pendingPickup: pendingNum,
    notAssignedToday: isSvp ? null : i % 4,
    pendingPickupSpx: isSvp ? null : i % 3,
    totalPicked: isSvp ? 500 + i * 10 : 80 + i * 2,
    commonLastPickupHour: isSvp ? "-" : `${17 + (i % 4)}:00`,
    ifPickedYesterday: i % 20 === 0 ? "No" : "Yes",
    latestAttemptTime: i % 5 === 0 ? "-" : `${14 + (i % 4)}:${String((i * 7) % 60).padStart(2, "0")}`,
    latestPtStatus: PT_STATUSES[i % PT_STATUSES.length],
    latestOnHoldReason: "-",
    driver: DRIVERS[i % DRIVERS.length],
    driverLastActive: i % 5 === 0 ? "-" : `${15 + (i % 3)}:${String((i * 11) % 60).padStart(2, "0")}`,
  };
});

const ALL_DATA: Row[] = [...BASE, ...generated];

const TYPE_OPTIONS = ["Seller", "SVP"];
const PUP_GROUP_OPTIONS = Array.from(new Set(ALL_DATA.map((r) => r.pupGroup).filter((g) => g !== "-")));
const SELLER_TAG_OPTIONS = ["Tag A", "Tag B", "Tag C"];
const CASE_TICKET_OPTIONS = ["Forget to assign", "Risk of mispickup", "Driver idling"];
const CASE_PRIORITY_OPTIONS = ["P1", "P2"];

export default function PendingPickupDetailsPage() {
  const [shopSvp, setShopSvp] = useState("");
  const [shopId, setShopId] = useState("");
  const [pupId, setPupId] = useState("");
  const [pupGroup, setPupGroup] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [type, setType] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sellerPupTag, setSellerPupTag] = useState("");
  const [caseTicketFilter, setCaseTicketFilter] = useState("");
  const [casePriorityFilter, setCasePriorityFilter] = useState("");

  const isNewCol = true;

  const [filtered, setFiltered] = useState<Row[]>(ALL_DATA);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    const result = ALL_DATA.filter((row) => {
      if (shopSvp && !row.shopSvp.toLowerCase().includes(shopSvp.toLowerCase())) return false;
      if (shopId && !row.shopId.toLowerCase().includes(shopId.toLowerCase())) return false;
      if (pupId && !row.pupId.toLowerCase().includes(pupId.toLowerCase())) return false;
      if (pupGroup && row.pupGroup !== pupGroup) return false;
      if (zoneId && !row.zoneId.toLowerCase().includes(zoneId.toLowerCase())) return false;
      if (type && row.type !== type) return false;
      if (caseTicketFilter && row.caseTicket !== caseTicketFilter) return false;
      if (casePriorityFilter && row.casePriority !== casePriorityFilter) return false;
      return true;
    });
    setFiltered(result);
    setCurrentPage(1);
    setSelected(new Set());
  };

  const handleReset = () => {
    setShopSvp(""); setShopId(""); setPupId("");
    setPupGroup(""); setZoneId(""); setType("");
    setStartTime(""); setEndTime(""); setSellerPupTag("");
    setCaseTicketFilter(""); setCasePriorityFilter("");
    setFiltered(ALL_DATA);
    setCurrentPage(1);
    setSelected(new Set());
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); }
      else if (next.size < 50) { next.add(id); }
      return next;
    });
  };

  const allPageSelected = paged.length > 0 && paged.every((r) => selected.has(r.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) { paged.forEach((r) => next.delete(r.id)); }
      else { paged.forEach((r) => { if (next.size < 50) next.add(r.id); }); }
      return next;
    });
  };

  const goTo = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const fmtNum = (n: number | null) => n === null ? "-" : n.toLocaleString();

  const pendingClass = (n: number | null) => {
    if (n === null) return "text-gray-900";
    if (n >= 1000) return "text-orange-500 font-medium cursor-pointer hover:underline";
    if (n >= 500) return "text-amber-500 cursor-pointer hover:underline";
    return "text-blue-600 cursor-pointer hover:underline";
  };

  const ptStatusClass = (s: PTStatus) => {
    if (s === "Pickup Start" || s === "Pickup Done") return "text-blue-600 cursor-pointer hover:underline";
    return "text-gray-900";
  };

  return (
    <FMSLayout
      breadcrumbs={[
        { label: "Hub Overview" },
        { label: "Pending Pickup Dashboard" },
      ]}
    >
      <FloatingWhatsNew module="Control Tower — Pending Pickup Dashboard" changes={CT_CHANGES} showFrf frfUrl="https://docs.google.com/document/d/1u5YZL3ARhbqQ4XHweymz8uFctdf1Qy0Fq5uMmPwcbys/edit?tab=t.0" />
      {/* Filters */}
      <div className="bg-white rounded border border-gray-200 p-4 mb-3">
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-2.5 mb-2.5">
          <FilterItem label="Shop/SVP">
            <input
              type="text"
              value={shopSvp}
              onChange={(e) => setShopSvp(e.target.value)}
              placeholder="Select"
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0"
            />
          </FilterItem>
          <FilterItem label="Shop ID">
            <input
              type="text"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              placeholder="Input"
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0"
            />
          </FilterItem>
          <FilterItem label="PUP ID">
            <input
              type="text"
              value={pupId}
              onChange={(e) => setPupId(e.target.value)}
              placeholder="Input"
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0"
            />
          </FilterItem>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-2.5 mb-2.5">
          <FilterItem label="PUP Group">
            <select
              value={pupGroup}
              onChange={(e) => setPupGroup(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 text-gray-600 bg-white"
            >
              <option value="">Select</option>
              {PUP_GROUP_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </FilterItem>
          <FilterItem label="Zone ID">
            <input
              type="text"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              placeholder="Input"
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0"
            />
          </FilterItem>
          <FilterItem label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 text-gray-600 bg-white"
            >
              <option value="">Select</option>
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </FilterItem>
        </div>

        {/* Row 3 — Case filters */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-2.5 mb-2.5">
          <FilterItem label="Case Ticket">
            <select
              value={caseTicketFilter}
              onChange={(e) => setCaseTicketFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 text-gray-900 bg-white"
            >
              <option value="">Select</option>
              {CASE_TICKET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </FilterItem>
          <FilterItem label="Case Priority">
            <select
              value={casePriorityFilter}
              onChange={(e) => setCasePriorityFilter(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 min-w-0 text-gray-900 bg-white"
            >
              <option value="">Select</option>
              {CASE_PRIORITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </FilterItem>
        </div>

        {/* Row 4 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-gray-600 whitespace-nowrap">Common Last Pickup Hour</span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Start Time"
                className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 w-24"
              />
              <span className="text-gray-400 text-sm">-</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="End Time"
                className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 w-24"
              />
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-gray-600 whitespace-nowrap">Seller/PUP Tag</span>
            <select
              value={sellerPupTag}
              onChange={(e) => setSellerPupTag(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 text-gray-600 bg-white w-36"
            >
              <option value="">Select</option>
              {SELLER_TAG_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
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
            <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded text-sm flex items-center gap-1 transition-colors">
              More
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="mb-3">
        <button className="flex items-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm transition-colors">
          Export all Results
          <span className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 flex items-center justify-center text-xs font-bold leading-none">i</span>
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded border border-gray-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
          <span className="text-sm text-gray-600">
            <span className="font-medium">{selected.size}</span> item(s) Selected,{" "}
            <span className="text-gray-400">50 Maximum</span>
          </span>
          <button
            disabled={selected.size === 0}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded text-sm transition-colors"
          >
            Go to Assign
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "separate", minWidth: "2600px" }}>
            <thead className="relative">
              {/* Row 1 — group labels + rowspan standalone headers */}
              <tr className="bg-gray-50">
                <th rowSpan={2} className="px-4 py-3 font-medium text-gray-900 text-center align-middle border-b border-gray-200 w-10">
                  <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="cursor-pointer" />
                </th>
                <ColTh2>Shop/SVP</ColTh2>
                <ColTh2>Shop ID</ColTh2>
                <ColTh2>PUP ID</ColTh2>
                <ColTh2>Type</ColTh2>
                <ColTh2>PUP Group</ColTh2>
                <ColTh2>Zone ID</ColTh2>
                <ColTh2>Seller/PUP Tag</ColTh2>

                <th colSpan={2} className={`px-4 py-2 font-semibold text-gray-900 text-center text-xs border-b border-gray-50 tracking-wide transition-colors duration-1000 ${isNewCol ? "bg-blue-100" : "bg-gray-50"}`}>
                  <span className="inline-flex items-center gap-1.5">
                    Case Ticket Info
                    <span className="inline-flex items-center bg-red-500 text-white font-bold rounded px-1.5 py-0.5 leading-none tracking-normal" style={{ fontSize: "9px" }}>NEW</span>
                  </span>
                </th>
                <th colSpan={2} className="px-4 py-2 font-semibold text-gray-900 text-center text-xs bg-gray-50 border-b border-gray-50 tracking-wide">
                  CS Ticket Info
                </th>
                <th colSpan={7} className="px-4 py-2 font-semibold text-gray-900 text-center text-xs bg-gray-50 border-b border-gray-50 tracking-wide">
                  Pickup Info
                </th>

                <ColTh2><span className="flex items-center gap-1">Latest PT Status <InfoIcon /></span></ColTh2>
                <ColTh2><span className="flex items-center gap-1">Latest On-hold Reason <InfoIcon /></span></ColTh2>

                <th colSpan={2} className="px-4 py-2 font-semibold text-gray-900 text-center text-xs bg-gray-50 border-b border-gray-50 tracking-wide">
                  Driver Info
                </th>
              </tr>

              {/* Row 2 — sub-headers for groups only */}
              <tr className="bg-gray-50 border-b border-gray-200">
                <ColTh highlight={isNewCol}>Case Ticket</ColTh>
                <ColTh highlight={isNewCol}>Priority</ColTh>
                <ColTh>CS Ticket</ColTh>
                <ColTh>CS Ticket Create Time</ColTh>
                <ColTh><span className="flex items-center gap-1">Pending Pickup <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Not Assigned Today <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Pending Pickup(SPX Picked) <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Total Picked <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Common Last Pickup Hour <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">If Picked Yesterday <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Latest Pickup Attempt Time <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Driver <InfoIcon /></span></ColTh>
                <ColTh><span className="flex items-center gap-1">Driver Last Active Time <InfoIcon /></span></ColTh>
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={22} className="text-center py-12 text-gray-400">No data found</td>
                </tr>
              ) : (
                paged.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected.has(row.id) ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} className="cursor-pointer" />
                    </td>
                    <td className="px-4 py-3 text-gray-900 max-w-[160px]">
                      <span className="block truncate" title={row.shopSvp}>{row.shopSvp}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.shopId}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap font-mono text-xs">{row.pupId}</td>
                    <td className="px-4 py-3 text-gray-900 whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-3 text-gray-900 max-w-[150px]">
                      <span className="block truncate" title={row.pupGroup}>{row.pupGroup}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.zoneId}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.sellerPupTag}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-gray-900 transition-colors duration-1000 ${isNewCol ? "bg-blue-50" : ""}`}>
                      {row.caseTicket === "-" ? <span className="text-gray-400">-</span> : row.caseTicket}
                    </td>
                    <td className={`px-4 py-3 text-center whitespace-nowrap transition-colors duration-1000 ${isNewCol ? "bg-blue-50" : ""}`}>
                      {row.casePriority === "P1" && (
                        <span className="inline-flex items-center justify-center bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">P1</span>
                      )}
                      {row.casePriority === "P2" && (
                        <span className="inline-flex items-center justify-center bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded">P2</span>
                      )}
                      {row.casePriority === "-" && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {row.csTicket !== "-" ? <span className="text-blue-600 hover:underline cursor-pointer">{row.csTicket}</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.csTicketCreateTime}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={pendingClass(row.pendingPickup)}>{fmtNum(row.pendingPickup)}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{fmtNum(row.notAssignedToday)}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{fmtNum(row.pendingPickupSpx)}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{fmtNum(row.totalPicked)}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.commonLastPickupHour}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.ifPickedYesterday}</td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.latestAttemptTime}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span className={ptStatusClass(row.latestPtStatus)}>{row.latestPtStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.latestOnHoldReason}</td>
                    <td className="px-4 py-3 text-gray-900 max-w-[150px]">
                      <span className="block truncate" title={row.driver}>{row.driver}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 text-center whitespace-nowrap">{row.driverLastActive}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <span className="text-sm text-gray-500">Total: {filtered.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goTo(1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-xs"
            >{"<<"}</button>
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600"
            >{"<"}</button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) { page = i + 1; }
              else if (currentPage <= 3) { page = i + 1; }
              else if (currentPage >= totalPages - 2) { page = totalPages - 4 + i; }
              else { page = currentPage - 2 + i; }
              return (
                <button
                  key={page}
                  onClick={() => goTo(page)}
                  className={`w-7 h-7 flex items-center justify-center rounded text-xs border transition-colors ${
                    page === currentPage ? "bg-red-600 text-white border-red-600" : "border-gray-300 text-gray-600 hover:border-red-400"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-400 text-xs">...</span>
                <button onClick={() => goTo(totalPages)} className="w-7 h-7 flex items-center justify-center rounded text-xs border border-gray-300 text-gray-600 hover:border-red-400">
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600"
            >{">"}</button>
            <button
              onClick={() => goTo(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 disabled:opacity-40 hover:border-red-400 hover:text-red-600 text-xs"
            >{">>"}</button>

            <span className="text-sm text-gray-500 ml-2">10 / Page</span>
            <span className="text-sm text-gray-500">Go to page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              className="w-12 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:border-red-400"
            />
            <button
              onClick={() => { const v = parseInt(goToPage); goTo(v); setGoToPage(""); }}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </FMSLayout>
  );
}

function FilterItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap w-24 flex-shrink-0">{label}</span>
      {children}
    </div>
  );
}

function ColTh2({ children }: { children: React.ReactNode }) {
  return (
    <th rowSpan={2} className="px-4 py-3 font-medium text-gray-900 text-left align-middle whitespace-nowrap bg-gray-50 border-b border-gray-200">
      {children}
    </th>
  );
}

function ColTh({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <th className={`px-4 py-2 font-medium text-gray-900 text-left whitespace-nowrap transition-colors duration-1000 ${highlight ? "bg-blue-100" : "bg-gray-50"}`}>
      {children}
    </th>
  );
}

function InfoIcon() {
  return (
    <span
      title="More info"
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-400 text-gray-400 cursor-help flex-shrink-0"
      style={{ fontSize: "9px", lineHeight: 1 }}
    >
      i
    </span>
  );
}
