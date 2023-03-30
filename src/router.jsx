import { createBrowserRouter } from "react-router-dom";
import { AppLayouts } from "@components/layouts";
import * as Page from "./pages";
import RequireAuth from "@components/layouts/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Page.SignInSide />,
  },
  {
    path: "/",
    element: <RequireAuth page={<AppLayouts />} />,
    children: [
      { path: "/projects/board", element: <Page.ProjectBoard /> },
      { path: "/projects/list", element: <Page.ProjectList /> },
      { path: "/project/:id/detail", element: <Page.ProjectDetail /> },
      { path: "/project/:id/absent", element: <Page.ProjectAbsent /> },
      { path: "/project/:id/event", element: <Page.ProjectEvent /> },
      { path: "/project/:id/boq", element: <Page.ProjectBoq /> },
      { path: "/project/:id/overtime", element: <Page.ProjectOvertime /> },
      { path: "/tracking", element: <Page.MapTracking /> },
      { path: "/weekly", element: <Page.WeeklyList /> },
      { path: "/absent", element: <Page.AbsentList /> },
      { path: "/payrol", element: <Page.PayrolList /> },
      { path: "/settings", element: <Page.SettingGeneral /> },
      { path: "/settings/employee", element: <Page.EmployeeList /> },
      { path: "/employee/:id/detail", element: <Page.EmployeeDetail
      
    /> },
      { path: "/settings/boq", element: <Page.BoqList /> },
      { path: "/settings/user", element: <Page.UserList /> },
    ],
  },
]);

export default router;
