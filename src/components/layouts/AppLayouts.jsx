import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { Header, SideBar, Copyright, Alert } from "@components/";
import { Outlet } from "react-router-dom";
import webTheme from "./webTheme";
import * as FRHooks from "frhooks";

const App = () => {
  const toket = localStorage.getItem("token");
  const { user } = FRHooks.useSelector(["user"]);
  const [trigger, setTrigger] = React.useState({
    open: true,
  });
  const { dispatch, clearMutation } = FRHooks.useDispatch("user", {
    type: "mutation",
    defaultValue: {},
  });

  React.useEffect(() => {
    (async () => {
      clearMutation("user");
      if (toket) {
        const data = await FRHooks.apiRoute()
          .auth("current")
          .get((resp) => resp.data);
        dispatch("user", data);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={webTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "100%",
          minHeight: "100%",
        }}
      >
        <CssBaseline />
        <Header
          open={trigger.open}
          headerRight={{
            name: user?.name || "",
            role: user?.role || "",
          }}
          onToggleDrawer={() => {
            setTrigger((state) => ({ open: !state.open }));
          }}
        />
        <SideBar
          open={trigger.open}
          onToggleDrawer={() => {
            setTrigger((state) => ({ open: !state.open }));
          }}
        />
        <Box
          component="main"
          sx={[
            {
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              minHeight: "100vh",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            },
          ]}
        >
          <Toolbar />
          <Container
            maxWidth="xl"
            sx={(theme) => ({
              flexGrow: 1,
              mt: 2,
              mb: 1,
              [theme.breakpoints.between("xs", "md")]: {
                pl: 0,
                pr: 0,
                mt: 0,
                mb: 0,
              },
            })}
          >
            <Outlet />
            <Alert />
          </Container>
          <Copyright sx={{ py: 1 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
