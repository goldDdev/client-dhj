import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import apiRoute from "./services/apiRoute";
import { HookProvider } from "frhooks";
import { api } from "./services/apiClient";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <HookProvider
      client={api}
      route={apiRoute}
      language={{ lang: "en", falback: "en", path: "/lang/" }}
    >
      <App />
    </HookProvider>
  // </React.StrictMode>
);
