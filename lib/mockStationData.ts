export type PickupStatus = "Created" | "Assigned" | "Completed" | "Canceled" | "Failed";

export interface PickupAssignment {
  id: number;
  trackingNumber: string;
  pickupPointId: string;
  pickupPointName: string;
  sellerName: string;
  sellerPhone: string;
  sellerDistrict: string;
  orderAccount: string;
  pickupAttempts: number;
  eta: string;
  status: PickupStatus;
  assignedDriver?: string;
  createTime: string;
}

const names = ["lala", "Ahmad Store", "Beauty SG", "Tech Hub", "Fresh Mart", "Baking Studio", "Gadget World", "Style Store"];
const accounts = ["NS Marketplace Standard", "NS Marketplace Premium", "CB Marketplace", "NS Official Store"];
const districts = ["Jurong East", "Tampines", "Bedok", "Ang Mo Kio", "Woodlands", "Clementi", "Bishan", "Yishun"];
const statuses: PickupStatus[] = ["Created", "Created", "Created", "Created", "Assigned", "Assigned", "Canceled", "Failed"];

export const mockPickupAssignments: PickupAssignment[] = Array.from({ length: 88 }, (_, i) => ({
  id: i + 1,
  trackingNumber: `SPXSG0${(62783000 + i * 137).toString()}...`,
  pickupPointId: `PUP2026051500${String(i % 10).padStart(2, "0")}BJ`,
  pickupPointName: ["Pandan Sorting Centre", "Jurong Hub", "Tampines Hub", "Bedok Hub"][i % 4],
  sellerName: names[i % names.length],
  sellerPhone: `****${(8000 + (i * 37) % 9999).toString().slice(-4)}`,
  sellerDistrict: districts[i % districts.length],
  orderAccount: accounts[i % accounts.length],
  pickupAttempts: i % 5 === 0 ? 1 : 0,
  eta: `2026-05-${String(19 + (i % 5)).padStart(2, "0")} 20:00:00`,
  status: statuses[i % statuses.length],
  assignedDriver: statuses[i % statuses.length] === "Assigned" ? "Eric Santoso" : undefined,
  createTime: `2026-05-${String(10 + (i % 8)).padStart(2, "0")} 14:30:00`,
}));
