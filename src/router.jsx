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
      { path: "/", element: <Page.ProjectList /> },
      { path: "/project/:id/detail", element: <Page.ProjectDetail /> },
      { path: "/project/:id/absent", element: <Page.ProjectAbsent /> },
      { path: "/project/:id/event", element: <Page.ProjectEvent /> },
      { path: "/project/:id/boq", element: <Page.ProjectBoq /> },
      { path: "/project/:id/overtime", element: <Page.ProjectOvertime /> },
      { path: "/project/:id/progres", element: <Page.ProjectProgres /> },
      { path: "/tracking", element: <Page.MapTracking /> },
      { path: "/weekly", element: <Page.WeeklyList /> },
      { path: "/daily", element: <Page.DailyList /> },
      { path: "/absent", element: <Page.AbsentList /> },
      { path: "/payrol", element: <Page.PayrolList /> },
      { path: "/employee", element: <Page.EmployeeList /> },
      { path: "/payrol/add", element: <Page.PayrolAdd /> },
      { path: "/settings", element: <Page.SettingGeneral /> },
      { path: "/settings/center-location", element: <Page.CenterLocationList /> },
      { path: "/employee/:id/detail", element: <Page.EmployeeDetail /> },
      { path: "/settings/boq", element: <Page.BoqList /> },
      { path: "/settings/user", element: <Page.UserList /> },
      { path: "/inventory/master", element: <Page.MasterInventoryList /> },
      { path: "/inventory/using", element: <Page.UsingInventoryList /> },
      { path: "/inventory/report", element: <Page.ReportInventoryList /> },
    ],
  },

  { path: "/payrol/:id", element: <Page.PayrolHtmlPdf /> },
  { path: "/download", element: <Page.Download /> },
  { path: "*", element: <Page.NotFound /> },
]);

export default router;
