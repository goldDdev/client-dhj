const apiRoute = {
  employee: {
    index: "/employee",
    profile: "/employee/profile",
    all: "/employee/all",
    detail: "/employee/:id",
    project: "/employee/:id/project",
    optional: "/employee/optional",
    absent: "/employee/:id/absent",
    validation: "/employee/validation",
  },
  boq: {
    index: "/boq",
    detail: "/boq/:id",
  },
  centerLocation: {
    all: "/center-location/all",
    index: "/center-location",
    detail: "/center-location/:id",
  },
  user: {
    index: "/user",
    detail: "/user/:id",
  },
  absent: {
    index: "/absent",
  },
  auth: {
    login: "/login",
    logout: "/logout",
    current: "/current",
  },
  progres: {
    all: "/progres/:id/all",
    confirm: "/progres/confirm",
    index: "/progres",
    detail: "/progres/:id",
  },
  payrol: {
    employee: "/payrol/:id/employee",
    employeeAll: "/payrol/employee/all",
    addMulti: "/payrol/multi",
    index: "/payrol",
    detail: "/payrol/:id",
  },
  project: {
    index: "/project",
    validation: "/project/validation",
    detail: "/project/:id",
    worker: "/project/worker",
    listWorkers: "/project/:id/worker",
    listAbsents: "/project/:id/absent",
    listKoms: "/project/:id/koms",
    listOvertimes: "/project/:id/overtimes",
    kom: "/project/kom",
    overtimeStatus: "/project/overtime/status",
    listBoqs: "/project/:id/boqs",
    boq: "/project/boq",
    boqValue: "/project/boq/value",
    boqImport: "/project/boq/import",
    listBoqSearch: "/project/:id/search",
    listProgress: "/project/:id/progress",
    listKomDetail: "/project/:id/kom",
    listBoqDetail: "/project/:id/boq",
    overtimeDetail: "/project/:id/overtime",
    overtime: "/project/overtime/:id",
    deleteWorker: "/project/:id/worker",
    detilAbsent: "/project/:id/:parent/absent",
    updateOvertime: "/project/overtime",
  },
  tracking: {
    index: "/tracking",
    location:"/tracking/location"
  },
  setting: {
    index: "/setting",
  },
  inventory: {
    index: "/inventory",
    detail: "/inventory/:id",
  },
  inventoryUsing: {
    index: "/use-inventory",
    status: "/use-inventory/status",
    report: "/use-inventory/report",
    items: "/use-inventory/:id/items",
    detail: "/use-inventory/:id",
  },
  weeklyPlan: {
    index: "/weekly-plan",
    project: "/weekly-plan/project",
    employee: "/weekly-plan/employee",
    destroy: "/weekly-plan/:id",
    validation: "/weekly-plan/validation",
  },

  dailyPlan: {
    index: "/daily-plan",
    project: "/daily-plan/project",
    employee: "/daily-plan/employee",
    destroy: "/daily-plan/:id",
    validation: "/daily-plan/validation",
  },
};

export default apiRoute;
