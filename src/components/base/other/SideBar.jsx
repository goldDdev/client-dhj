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
import logoSmall from "@assets/png/logo-small.png";

const menu = [
  {
    canAccess: [],
    text: "Proyek",
    link: "/projects/list",
    icon: icon.Add,
  },
  { canAccess: [], text: "Karyawan", link: "/employee", icon: icon.People },
  {
    canAccess: [],
    text: "Pelacakan",
    link: "/tracking",
    icon: icon.Map,
  },
  {
    canAccess: [],
    text: "Absensi",
    link: "/absent",
    icon: icon.ListAlt,
  },
  {
    canAccess: [],
    text: "Resource Plan",
    link: "",
    icon: icon.Inventory,
    children: [
      {
        canAccess: [],
        text: "Daily Plan",
        link: "/daily",
        icon: icon.SummarizeOutlined,
      },
      {
        canAccess: [],
        text: "Weekly Plan",
        link: "/weekly",
        icon: icon.SummarizeOutlined,
      },
    ],
  },
  {
    canAccess: [],
    text: "Penggajian",
    link: "/payrol",
    icon: icon.RequestQuote,
  },
  {
    canAccess: [],
    text: "Inventori",
    link: "",
    icon: icon.Inventory,
    children: [
      { canAccess: [], text: "Master Item", link: "/inventory/master" },
      { canAccess: [], text: "Penggunaan", link: "/inventory/using" },
      { canAccess: [], text: "Laporan", link: "/inventory/report" },
    ],
  },
  {
    canAccess: [],
    text: "Pengaturan",
    link: "/settings",
    icon: icon.Settings,
    children: [
      { canAccess: [], text: "Pengguna", link: "/settings/user" },
      // { canAccess: [], text: "BOQ", link: "/settings/boq" },
      { canAccess: [], text: "Umum", link: "/settings" },
      {
        canAccess: [],
        text: "Pusat Lokasi",
        link: "/settings/center-location",
      },
    ],
  },
];

const SideBar = (props) => {
  const { window } = props;
  const [openParent, setOpenParent] = React.useState(-1);
  const navigate = useNavigate();
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const onClick = (value, index, mobile) => () => {
    if (value.children && value.children.length > 0) {
      setOpenParent((state) => (state === index ? -1 : index));
    } else {
      navigate(value.link);
      if (mobile) {
        props.onToggleMobileDrawer();
      }
    }
  };

  return (
    <>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <MobileDrawer
        container={container}
        variant="temporary"
        open={props.openMobile}
        onClose={props.onToggleMobileDrawer}
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
          <img src={logo} alt="PT. Duta Hita Jaya" height={50} />
          <IconButton onClick={props.onToggleMobileDrawer}>
            <icon.ChevronLeft />
          </IconButton>
        </Toolbar>

        <Divider />
        <List>
          {menu.length > 0 &&
            menu.map((val, index) => (
              <li key={index}>
                <ListItemButton onClick={onClick(val, index, true)}>
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
                            onClick={onClick(_val, j, true)}
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
            justifyContent: "center",
            px: [1],
          }}
        >
          <img
            src={props.open ? logo : logoSmall}
            alt="PT. Duta Hita Jaya"
            height={props.open ? 50 : 60}
          />
        </Toolbar>

        <Divider />
        <List>
          {menu.length > 0 &&
            menu.map((val, index) => (
              <li key={index}>
                <ListItemButton onClick={onClick(val, index, false)}>
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
                            onClick={onClick(_val, j, false)}
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
