import { AppBar, BasicDropdown } from "@components/";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useSelector, apiRoute } from "frhooks";
import { useAlert } from "@contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";

const Header = (props) => {
  const { user } = useSelector(["user"]);
  const alert = useAlert();
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" open={props.open} elevation={0} color="inherit">
      <Toolbar
        sx={{
          pr: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.onToggleDrawer}
          sx={{
            marginRight: "36px",
            transform: "rotate(90deg)",
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "block",
              xl: "block",
            },
          }}
        >
          <BarChartIcon color="primary" />
        </IconButton>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={props.onToggleMobileDrawer}
          sx={{
            marginRight: "36px",
            display: {
              xs: "block",
              sm: "block",
              md: "block",
              lg: "none",
              xl: "none",
            },
          }}
        >
          <Menu color="primary" />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        ></Typography>

        <Box sx={{ ml: 2 }}>
          <BasicDropdown
            type="icon"
            label={<Avatar alt={user?.employee?.name || "A"} />}
            menu={[
              { text: `Hi, ${user?.employee?.name || ""}`, divider: true },
              { text: "Profil", divider: true },
              {
                text: "Keluar",
                onClick: () => {
                  alert.set({
                    open: true,
                    title: "Mohon Perhatian",
                    message: "Anda keluar dari applikasi ini, anda yakin?",
                    type: "warning",
                    loading: false,
                    close: {
                      text: "Keluar",
                    },
                    confirm: {
                      text: "Ya, Saya Mengerti",
                      onClick: async () => {
                        try {
                          alert.set({ loading: true });
                          await apiRoute().auth("logout").sendJson();
                          localStorage.removeItem("token");
                          navigate("/login");
                        } catch (err) {
                        } finally {
                          alert.reset();
                        }
                      },
                    },
                  });
                },
              },
            ]}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
