import moment from "moment";

export const user = {
  id: 0,
  email: "",
  employee_id: 0,
  name: "",
  phoneNumber: "",
  role: "ADMIN",
};

export const boq = {
  id: 0,
  name: "",
  typeUnit: "",
};

export const employee = {
  id: 0,
  name: "",
  cardID: "",
  phoneNumber: "",
  salary: 0,
  hourlyWages: 0,
  role: "WORKER",
  email: "",
};

export const project = {
  id: 0,
  name: "",
  noSpk: "",
  companyName: "",
  contact: "",
  startAt: null,
  finishAt: null,
  duration: 0,
  price: 0,
  location: "",
  latitude: 0,
  longitude: 0,
  status: "DRAFT",
  note: "",
};

export const kom = {
  id: 0,
  title: "",
  projectId: 0,
  description: "",
  datePlan: moment().format("yyyy-MM-DD"),
  timePlan: moment().format("HH:00:00"),
  status: "PLAN",
};

export const projectBoq = {
  id: 0,
  boqId: 0,
  projectId: 0,
};

export const inventory = {
  id: 0,
  name: "",
  unit: "",
  qty: 0,
  minQty: 0,
  type: "MATERIAL",
  projectId: 0,
};

export const usingInventory = {
  date: "",
  projectId: 0,
  userId: 0,
  items: [],
};

export const weeklyPlan = {
  id: 0,
  projectId: 0,
  employeeId: 0,
  projectName: "",
  name: "",
  role: "",
  startDate: moment().format("yyyy-MM-DD"),
  endDate: moment().format("yyyy-MM-DD"),
};
