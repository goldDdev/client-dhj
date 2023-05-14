import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import webTheme from "@components/layouts/webTheme";
import bg from "../../assets/jpg/hero-bg.jpg";
import logo from "../../assets/png/logo-dhj.png";
import * as FRHooks from "frhooks";
import apiRoute from "@services/apiRoute";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let timer;

  const { dispatch } = FRHooks.useDispatch("user", {
    type: "mutation",
    defaultValue: {},
  });
  const mutation = FRHooks.useMutation({
    defaultValue: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.post(apiRoute.auth.login, {
      validation: true,
      onSuccess: ({ data }) => {
        localStorage.setItem("token", data.token);
        dispatch("user", data.user);
        navigate("/projects/list");
      },
      onError: (e) => {
        if (e.response?.status === 400) {
          mutation.setError({ email: "Alamat email atau password salah" });
        }
      },
    });
  };

  React.useEffect(() => {
    if (!localStorage.getItem("token")) return;

    enqueueSnackbar("Kamu Sudah Login Loh");
    timer = setTimeout(() => {
      navigate("/projects/list");
      clearTimeout(timer);
    }, 1000);

    return () => {
      clearTimeout(timer);
      mutation.cancel();
    };
  }, []);

  return (
    <ThemeProvider theme={webTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={logo} alt="" height={50} />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={mutation.data.email || ""}
                onChange={(e) => {
                  mutation.setData({ email: e.target.value });
                }}
                error={mutation.error("email")}
                helperText={mutation.message("email")}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={mutation.data.password || ""}
                onChange={(e) => {
                  mutation.setData({ password: e.target.value });
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
