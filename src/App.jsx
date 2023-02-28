import { RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import router from "./router";

function App() {
  return (
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
  );
}

export default App;
