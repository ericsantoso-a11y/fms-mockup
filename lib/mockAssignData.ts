export type PUPType = "NS" | "SP" | "Seller" | "DOP";
export type ServiceType = "Standard" | "Sameday" | "Express";

export interface PendingSeller {
  id: number;
  pickupPointId: string;
  shopSpIds: string;
  shopSpNames: string;
  shopSpAddress: string;
  pupType: PUPType;
  serviceType: ServiceType;
  manualPUPG: string;
  mappedPUPG: string;
  postCode: string;
  sellerPupTag: string;
  preferredPickupTime: string;
  eta: string;
}

const serviceTypes: ServiceType[] = ["Standard", "Standard", "Sameday", "Express", "Express", "Standard"];
const pupTypes: PUPType[] = ["NS", "NS", "SP", "Seller", "Seller", "DOP"];
const tags = ["-", "-", "SP", "-", "-", "Seller", "-"];
const addresses = [
  "CWT Commodity Hub, 24 Penjuru Road, #09-04",
  "123 Sender St",
  "Block 531 Bedok North Street 3, #01-694B, Singapore 460531",
  "KfWgdZurAUeEllwQvng Singapore, Singapore, Singapore",
  "FO_AUTO_CASE_ADDR Singapore",
  "pBEuXqimaBaxOKVYu Singapore 310085",
  "Blk 204 Jurong East St 21, #02-188, Singapore 600204",
  "12 Woodlands Link, Singapore 738716",
];
const names = [
  "Kenwood Appliances (S) Pte Ltd",
  "John Doe",
  "FAH THAI SUPER@Block 531 Bedok North Street 3, #01-694B, Singapore 460531",
  "AZMgKKotuVKOoH...",
  "FO_AUTO_CASE_SE...",
  "FgtWtcrPsGdiVWEfi...",
  "Shopee SG Official",
  "Fresh Market SG",
];
const shopIds = ["NS7651240563", "NS8549729197", "DOP31", "45828982", "1008612", "45828982", "NS7123456", "SP9988776"];
const postCodes = ["688186", "688186", "460531", "88888881", "824271", "88888881", "600204", "738716"];
const pupIds = [
  "PUP2025100100017G", "PUP202509260017E", "PUP20230113026W1",
  "PUP20241004003QD", "PUP202408050038L", "PUP20240628003AX",
  "PUP20240512001BX", "PUP20240309002WL",
];

export const mockPendingSellers: PendingSeller[] = Array.from({ length: 72 }, (_, i) => ({
  id: i + 1,
  pickupPointId: pupIds[i % pupIds.length] + (i >= 8 ? `_${i}` : ""),
  shopSpIds: shopIds[i % shopIds.length],
  shopSpNames: names[i % names.length],
  shopSpAddress: addresses[i % addresses.length],
  pupType: pupTypes[i % pupTypes.length],
  serviceType: serviceTypes[i % serviceTypes.length],
  manualPUPG: "Unknown Group",
  mappedPUPG: "Unknown Group",
  postCode: postCodes[i % postCodes.length],
  sellerPupTag: tags[i % tags.length],
  preferredPickupTime: "-",
  eta: "-",
}));
