import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import { IconButton, Typography } from "@mui/material";

export default ({ menu, label, type, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {type === "icon" ? (
        <IconButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          {...props}
        >
          {label}
        </IconButton>
      ) : (
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          {...props}
        >
          {label || ""}
        </Button>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          dense: true,
        }}
      >
        {menu.map(({ text, onClick, ...b }, i) => (
          <ListItemButton
            key={i}
            onClick={() => {
              if (onClick) onClick();
              setAnchorEl(null);
            }}
            {...b}
          >
            {typeof text === "string" ? (
              <Typography variant="body2">{text}</Typography>
            ) : (
              text
            )}
          </ListItemButton>
        ))}
      </Menu>
    </div>
  );
};
