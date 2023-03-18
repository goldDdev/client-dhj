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
    kom: "/project/kom",
    listBoqs: "/project/:id/boqs",
    boq: "/project/boq",
    listBoqSearch: "/project/:id/search",
    listKomDetail: "/project/:id/kom",
    listBoqDetail: "/project/:id/boq",
    deleteWorker: "/project/:id/worker",
    detilAbsent: "/project/:id/:parent/absent",
  },
  setting:{
    index: "/setting"
  }
};

export default apiRoute;
