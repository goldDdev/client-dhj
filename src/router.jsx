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
      { path: "/settings", element: <Page.EmployeeList /> },
      { path: "/projects/board", element: <Page.ProjectBoard /> },
      { path: "/projects/list", element: <Page.ProjectList /> },
      { path: "/tracking", element: <Page.MapTracking /> },
    ],
  },
]);

export default router;
