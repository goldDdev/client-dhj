import React from "react";
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
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import * as icon from "@mui/icons-material";
import logo from "@assets/png/logo-dhj.png";

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
    link: "/projects",
    icon: icon.Add,
    children: [
      { canAccess: [], text: "Board", link: "/projects/board" },
      { canAccess: [], text: "Daftar", link: "/projects/list" },
    ],
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
    link: "/tracking",
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
    children: [
      { canAccess: [], text: "Pengguna", link: "/projects/list" },
      { canAccess: [], text: "Karyawan", link: "/settings" },
      { canAccess: [], text: "BOC", link: "/settings" },
      { canAccess: [], text: "Umum", link: "/settings" },
    ],
  },
];

const SideBar = (props) => {
  const { window } = props;
  const [openParent, setOpenParent] = React.useState(-1);
  const navigate = useNavigate();
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const onClick = (value, index) => () => {
    if (value.children && value.children.length > 0) {
      setOpenParent((state) => (state === index ? -1 : index));
    } else {
      navigate(value.link);
    }
  };

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
          <li>
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
          </li>
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
          <img src={logo} alt="PT. Duta Hita Jaya" height={50} />
          <IconButton onClick={props.onToggleDrawer}>
            <icon.ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider />
        <List>
          {menu.length > 0 &&
            menu.map((val, index) => (
              <li key={index}>
                <ListItemButton onClick={onClick(val, index)}>
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
                  {val.children ? (
                    openParent === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : null}
                </ListItemButton>
                {val.children
                  ? val.children.map((_val, j) => (
                      <Collapse
                        in={openParent === index}
                        key={`${index}${j}`}
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          <ListItemButton
                            sx={{ pl: 6 }}
                            onClick={onClick(_val, j)}
                          >
                            {_val.icon ? (
                              <ListItemIcon>
                                <Tooltip title={_val.text}>
                                  <SvgIcon component={_val.icon} />
                                </Tooltip>
                              </ListItemIcon>
                            ) : null}
                            <ListItemText
                              primary={_val.text}
                              primaryTypographyProps={{
                                fontWeight: 500,
                              }}
                            />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    ))
                  : null}
              </li>
            ))}
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
