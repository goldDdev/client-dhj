import { Button, IconButton, Menu, styled } from "@mui/material";
import { memo, useId } from "react";
import DropdownItem from "./DropdownItem";

const StyledMenu = styled((props) => (
  <Menu
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiList-root": {
    paddingTop: 0,
    paddingBottom: 0,
  },
  // "& .MuiPaper-root": {
  // },
  "& .MuiDivider-root": {
    marginBottom: 0,
    marginTop: 0,
  },
}));

const Dropdown = ({
  type,
  menu,
  anchorEl,
  onClick,
  onClose,
  children,
  MenuProps,
  ButtonProps,
  IconButtonProps,
}) => {
  const id = useId
  return (
    <div>
      {type === "Button" && (
        <Button
          onClick={onClick}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
          {...ButtonProps}
        >
          {children}
        </Button>
      )}

      {type === "Icon" && (
        <IconButton onClick={onClick} {...IconButtonProps}>
          {children}
        </IconButton>
      )}

      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={onClose}
        {...MenuProps}
      >
        {menu &&
          menu.map((value, i) => (
            <DropdownItem key={"menu-item-" + i} {...value} />
          ))}
      </StyledMenu>
    </div>
  );
};

export default memo(Dropdown);

Dropdown.defaultProps = {
  type: "Button",
  ButtonProps: {
    variant: "contained",
  },
};
