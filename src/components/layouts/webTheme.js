import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let webTheme = createTheme({
  components: {
    MuiCssBaseline: {
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
        fullWidth: true,
      },
    },
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          letterSpacing: ".25px",
        },
      },
    },
  },
});

webTheme = responsiveFontSizes(webTheme);

export default webTheme;
