import React from "react";
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { Header, SideBar, Copyright, Alert } from "@components/";
import { Outlet, useLocation, useParams } from "react-router-dom";
import webTheme from "./webTheme";
import * as FRHooks from "frhooks";
import ProfileDialog from "../../pages/auth/ProfileDialog";
import apiRoute from "@services/apiRoute";
import { useSnackbar } from "notistack";

const App = () => {
  const location = useLocation();
  const { id } = useParams();
  const listUrl = [
    `/project/detail/${id}`,
    `/project/${id}/event`,
    `/project/${id}/boq`,
    `/project/${id}/progres`,
    `/project/${id}/absent`,
    `/project/${id}/overtime`,
  ];
  const toket = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const { user } = FRHooks.useSelector(["user"]);
  const [trigger, setTrigger] = React.useState({
    open: true,
    openMobile: false,
    openProfile: false,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: {
      id: 0,
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      role: "",
    },
    schema: (y) =>
      y.object().shape({
        id: y.number(),
        name: y.string(),
        phoneNumber: y.string(),
        email: y.string().email(),
        password: y.string().nullable(),
        role: y.string().nullable(),
      }),
  });

  const { dispatch, clearMutation } = FRHooks.useDispatch("user", {
    type: "mutation",
    defaultValue: {},
  });

  const onSubmit = () => {
    mutation.put(apiRoute.employee.profile, {
      validation: true,
      onSuccess: async () => {
        const data = await FRHooks.apiRoute()
          .auth("current")
          .get((resp) => resp.data);
        dispatch("user", data);
        setTrigger((state) => ({
          ...state,
          openProfile: !state.openProfile,
        }));
        enqueueSnackbar("Profile Berhasil diperaharui");
      },
    });
  };

  React.useEffect(() => {
    (async () => {
      clearMutation("user");
      if (toket) {
        const data = await FRHooks.apiRoute()
          .auth("current")
          .get((resp) => resp.data);
        dispatch("user", data);
        mutation.setData({
          id: data?.employee?.id || 0,
          name: data?.employee?.name || "",
          phoneNumber: data?.employee?.phoneNumber || "",
          email: data?.email || "",
          role: data?.employee?.role || "",
          password: "",
        });
      }
    })();
  }, []);

  React.useEffect(() => {
    setTrigger((p) => ({ ...p, open: !listUrl.includes(location.pathname) }));
  }, [location.pathname]);

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
            setTrigger((state) => ({ ...state, open: !state.open }));
          }}
          onToggleMobileDrawer={() => {
            setTrigger((state) => ({
              ...state,
              openMobile: !state.openMobile,
            }));
          }}
          onToggleProfile={() => {
            setTrigger((state) => ({
              ...state,
              openProfile: !state.openProfile,
            }));
          }}
        />
        <SideBar
          open={trigger.open}
          openMobile={trigger.openMobile}
          onToggleDrawer={() => {
            setTrigger((state) => ({ open: !state.open }));
          }}
          onToggleMobileDrawer={() => {
            setTrigger((state) => ({ openMobile: !state.openMobile }));
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
              height: "100vh",
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
                pl: 1,
                pr: 1,
                mt: 1,
                mb: 0,
              },
            })}
          >
            <Outlet />
            <Alert />
            <ProfileDialog
              open={trigger.openProfile}
              mutation={mutation}
              onClose={() => {
                setTrigger((state) => ({
                  ...state,
                  openProfile: !state.openProfile,
                }));
              }}
              onSubmit={onSubmit}
            />
          </Container>
          <Copyright sx={{ py: 1 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
