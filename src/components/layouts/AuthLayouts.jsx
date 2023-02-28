import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import webTheme from "./webTheme";

const AuthLayouts = () => {
  return (
    <ThemeProvider theme={webTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "100vh",
          minHeight: "100vh",
        }}
      >
        <Container component="main" maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayouts;
