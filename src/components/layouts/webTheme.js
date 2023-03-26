import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let webTheme = createTheme({
  palette:{
    primary: {
      main: '#0E3386'
    }
  },
  components: {
    MuiCssBaseline: {
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true
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
