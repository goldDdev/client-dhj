import { createBrowserRouter } from "react-router-dom";
import { AppLayouts } from "@components/layouts";
import * as Page from "./pages";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Page.SignInSide />,
  },
  {
    path: "/",
    element: <AppLayouts />,
    children: [
      { path: "/projects/board", element: <Page.ProjectBoard /> },
      { path: "/projects/list", element: <Page.ProjectList /> },
      { path: "/project/:id/detail", element: <Page.ProjectDetail /> },
      { path: "/project/:id/absent", element: <Page.ProjectAbsent /> },
      { path: "/tracking", element: <Page.MapTracking /> },
      { path: "/absent", element: <Page.AbsentList /> },
      { path: "/payrol", element: <Page.PayrolList /> },
      { path: "/settings", element: <Page.SettingGeneral /> },
      { path: "/settings/employee", element: <Page.EmployeeList /> },
      { path: "/settings/boq", element: <Page.BoqList /> },
      { path: "/settings/user", element: <Page.UserList /> },
    ],
  },
]);

export default router;
