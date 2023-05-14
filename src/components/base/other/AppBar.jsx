import { styled } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  [theme.breakpoints.between("lg", "xl")]: {
    width: `calc(100% - ${240 - 168}px)`,
  },
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up("lg")]: {
    zIndex: theme.zIndex.drawer,
  },
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.between("lg", "xl")]: {
    ...(open && {
      marginLeft: 240,
      width: `calc(100% - ${240}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

export default AppBar;
