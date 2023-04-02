const apiRoute = {
  employee: {
    index: "/employee",
    detail: "/employee/:id",
    project: "/employee/:id/project",
    absent: "/employee/:id/absent",
    validation: "/employee/validation",
  },
  boq: {
    index: "/boq",
    detail: "/boq/:id",
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
    listBoqSearch: "/project/:id/search",
    listProgress: "/project/:id/progress",
    listKomDetail: "/project/:id/kom",
    listBoqDetail: "/project/:id/boq",
    overtimeDetail: "/project/:id/overtime",
    deleteWorker: "/project/:id/worker",
    detilAbsent: "/project/:id/:parent/absent",
  },
  tracking: {
    index: "/tracking",
  },
  setting: {
    index: "/setting",
  },
  inventory: {
    index: "/inventory",
    detail: "/inventory/:id",
  },
};

export default apiRoute;
