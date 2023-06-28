import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import router from "./router";
import { AlertProvider } from "@contexts/AlertContext";

function App() {
  return (
    <AlertProvider>
      <SnackbarProvider
        autoHideDuration={2000}
        maxSnack={3}
        variant="success"
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AlertProvider>
  );
}

export default App;
