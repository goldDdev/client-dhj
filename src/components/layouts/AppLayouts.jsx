import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import { Header, SideBar, Copyright } from "@components/";
import { Outlet } from "react-router-dom";
import webTheme from "./webTheme";

const App = () => {
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
          open={true}
          headerRight={undefined}
          onClickDrawer={function () {
            throw new Error("Function not implemented.");
          }}
        />
        <SideBar
          open={true}
          navItems={[]}
          onClickDrawer={function () {
            throw new Error("Function not implemented.");
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
              height: "100vh",
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
            {/* <Alert /> */}
          </Container>
          <Copyright sx={{ py: 1 }} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
