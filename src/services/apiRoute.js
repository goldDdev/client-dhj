const apiRoute = {
  employee: {
    index: "/employee",
    detail: "/employee/:id/detail",
  },
  boq: {
    index: "/boq",
    detail: "/boq/:id",
  },
  project: {
    index: "/project",
    detail: "/project/:id/detail",
    worker: "/project/worker",
    deleteWorker: "/project/:id/worker",
  },
};

export default apiRoute;
