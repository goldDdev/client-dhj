import { AppBar } from "@components/";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const Header = (props) => {
  return (
    <AppBar position="fixed" open={!props.isSmall && props.open} color="inherit" elevation={0}> 
      {!props.enableBack && (
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.onToggleDrawer}
            sx={{
              marginRight: "36px",
              ...(!props.isSmall && props.open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {process.env.VITE_APP_NAME}
          </Typography>

          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Box sx={{ flexGrow: 0, ml: 2 }}>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={null}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(null)}
            >
              <MenuItem>
                <Typography textAlign="center">Profil</Typography>
              </MenuItem>

              <MenuItem>
                <Typography textAlign="center">Ubah Kata Sandi</Typography>
              </MenuItem>

              <MenuItem>
                <Typography textAlign="center">Keluar</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      )}

      {props.enableBack && (
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleBack}
          >
            <ArrowBack />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {props.title || "Title"}
          </Typography>
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Header;
