import Drawer from "./Drawer";
import {
  Divider,
  Drawer as MobileDrawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as icon from "@mui/icons-material";

const menu = [
  {
    canAccess: [],
    text: "Beranda",
    link: "",
    icon: icon.Dashboard,
  },
  {
    canAccess: [],
    text: "Proyek",
    link: "",
    icon: icon.Add,
  },
  {
    canAccess: [],
    text: "Absensi",
    link: "",
    icon: icon.ListAlt,
  },
  {
    canAccess: [],
    text: "Pelacakan",
    link: "",
    icon: icon.Map,
  },
  {
    canAccess: [],
    text: "Penggajian",
    link: "",
    icon: icon.Money,
  },
  {
    canAccess: [],
    text: "Pengaturan",
    link: "/settings",
    icon: icon.Settings,
  },
];

const SideBar = (props) => {
  const { window } = props;
  const navigate = useNavigate();
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <MobileDrawer
        container={container}
        variant="temporary"
        open={props.open}
        onClose={props.onToggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: "block",
            sm: "block",
            md: "block",
            lg: "none",
            xl: "none",
          },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={props.onToggleDrawer}>
            <icon.ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider />
        <List>
          <div>
            {menu.length > 0 &&
              menu.map((val, index) => (
                <ListItemButton key={index} onClick={() => console.log("hai")}>
                  <ListItemIcon>
                    <Tooltip title={val.text}>
                      <SvgIcon component={val.icon} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary={val.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              ))}
          </div>
        </List>
      </MobileDrawer>

      <Drawer
        variant="permanent"
        open={props.open}
        sx={{
          display: {
            xs: "none",
            sm: "none",
            md: "none",
            lg: "block",
            xl: "block",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: [1],
          }}
        >
          <Typography sx={{ flexGrow: 1 }} align="center" fontWeight={500}>
            {import.meta.env.REACT_APP_NAME || "React App"}
          </Typography>
          <IconButton onClick={props.onToggleDrawer}>
            <icon.ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider />
        <List>
          <div>
            {menu.length > 0 &&
              menu.map((val, index) => (
                <ListItemButton key={index} onClick={() => navigate(val.link)}>
                  <ListItemIcon>
                    <Tooltip title={val.text}>
                      <SvgIcon component={val.icon} />
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary={val.text}
                    primaryTypographyProps={{
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              ))}
          </div>
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
