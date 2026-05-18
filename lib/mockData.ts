export interface PickupGroup {
  id: number;
  name: string;
  groupLead: string;
  groupLeadId: number;
  groupMembers: { id: number; name: string }[];
  description: string;
}

export const mockPickupGroups: PickupGroup[] = [
  {
    id: 12,
    name: "Pickup Alpha Team",
    groupLead: "Eric Santoso",
    groupLeadId: 2001,
    groupMembers: [
      { id: 2002, name: "James Lim" },
      { id: 2003, name: "Sarah Tan" },
    ],
    description: "First mile group for North region",
  },
  {
    id: 11,
    name: "Pickup Beta Team",
    groupLead: "Michael Chen",
    groupLeadId: 2010,
    groupMembers: [
      { id: 2011, name: "Kevin Wong" },
      { id: 2012, name: "Priya Nair" },
      { id: 2013, name: "Ali Hassan" },
    ],
    description: "First mile group for South region",
  },
  {
    id: 10,
    name: "Pickup Gamma",
    groupLead: "Linda Goh",
    groupLeadId: 2020,
    groupMembers: [{ id: 2021, name: "Tom Ng" }],
    description: "-",
  },
  {
    id: 9,
    name: "XGG Pickup",
    groupLead: "Raj Kumar",
    groupLeadId: 2030,
    groupMembers: [
      { id: 2031, name: "Benny Ong" },
      { id: 2032, name: "Clara Yeo" },
    ],
    description: "-",
  },
  {
    id: 8,
    name: "Pickup Central Hub",
    groupLead: "Zhen Wei",
    groupLeadId: 2040,
    groupMembers: [
      { id: 2041, name: "Marcus Tay" },
      { id: 2042, name: "Nurul Ain" },
      { id: 2043, name: "Derek Foo" },
    ],
    description: "Handles central sorting facility runs",
  },
  {
    id: 7,
    name: "Pickup East Wing",
    groupLead: "Ivan Ng",
    groupLeadId: 2050,
    groupMembers: [{ id: 2051, name: "Felicia Lim" }],
    description: "-",
  },
  {
    id: 6,
    name: "Pickup West Wing",
    groupLead: "Jasmine Ho",
    groupLeadId: 2060,
    groupMembers: [
      { id: 2061, name: "Bernard Koh" },
      { id: 2062, name: "Shirley Chua" },
    ],
    description: "-",
  },
  {
    id: 5,
    name: "test_pickup_group",
    groupLead: "SPX_testing",
    groupLeadId: 1159,
    groupMembers: [{ id: 1239, name: "ren jia" }],
    description: "-",
  },
  {
    id: 4,
    name: "Pickup Locker Run",
    groupLead: "PT3",
    groupLeadId: 1237,
    groupMembers: [],
    description: "-",
  },
  {
    id: 3,
    name: "Pickup Parcel Transfer",
    groupLead: "kevin felixiano",
    groupLeadId: 1234,
    groupMembers: [{ id: 1230, name: "Yiming" }],
    description: "-",
  },
  {
    id: 2,
    name: "Pickup Group F",
    groupLead: "sanjin_de3",
    groupLeadId: 1286,
    groupMembers: [
      { id: 1204, name: "SHOPEE-SG-013" },
      { id: 1203, name: "SHO..." },
    ],
    description: "-",
  },
  {
    id: 1,
    name: "xgtestgroup Pickup",
    groupLead: "joyce test 9",
    groupLeadId: 1223,
    groupMembers: [{ id: 1224, name: "xgtestSub" }],
    description: "-",
  },
];

export const mockDriverOptions = [
  { id: 2001, name: "Eric Santoso" },
  { id: 2002, name: "James Lim" },
  { id: 2003, name: "Sarah Tan" },
  { id: 2010, name: "Michael Chen" },
  { id: 2011, name: "Kevin Wong" },
  { id: 2012, name: "Priya Nair" },
  { id: 2013, name: "Ali Hassan" },
  { id: 2020, name: "Linda Goh" },
  { id: 2021, name: "Tom Ng" },
  { id: 2030, name: "Raj Kumar" },
  { id: 2031, name: "Benny Ong" },
  { id: 2032, name: "Clara Yeo" },
  { id: 2040, name: "Zhen Wei" },
  { id: 2041, name: "Marcus Tay" },
  { id: 2042, name: "Nurul Ain" },
  { id: 2043, name: "Derek Foo" },
  { id: 2050, name: "Ivan Ng" },
  { id: 2051, name: "Felicia Lim" },
  { id: 2060, name: "Jasmine Ho" },
  { id: 2061, name: "Bernard Koh" },
  { id: 2062, name: "Shirley Chua" },
  { id: 1159, name: "SPX_testing" },
  { id: 1237, name: "PT3" },
  { id: 1234, name: "kevin felixiano" },
  { id: 1230, name: "Yiming" },
  { id: 1239, name: "ren jia" },
  { id: 1286, name: "sanjin_de3" },
  { id: 1223, name: "joyce test 9" },
  { id: 1224, name: "xgtestSub" },
];
