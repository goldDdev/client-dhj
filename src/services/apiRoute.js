const apiRoute = {
  employee: {
    index: "/employee",
    detail: "/employee/:id/detail",
  },
  boq: {
    index: "/boq",
    detail: "/boq/:id",
  },
  user: {
    index: "/user",
    detail: "/user/:id",
  },
  project: {
    index: "/project",
    detail: "/project/:id/detail",
    worker: "/project/worker",
    listWorkers: "/project/:id/worker",
    listAbsents: "/project/:id/absent",
    listKoms: "/project/:id/koms",
    listKom: "/project/kom",
    listKomDetail: "/project/:id/kom",
    deleteWorker: "/project/:id/worker",
    detilAbsent: "/project/:id/:parent/absent",
  },
};

export default apiRoute;
