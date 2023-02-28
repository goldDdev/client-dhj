import { createBrowserRouter } from "react-router-dom";
import { AppLayouts, AuthLayouts } from "@components/layouts";
import * as Page from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayouts />,
    children: [{ path: "/settings", element: <Page.Employee.List /> }],
  },
]);

export default router;
