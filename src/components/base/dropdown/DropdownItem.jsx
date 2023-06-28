import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SvgIcon,
} from "@mui/material";

const DropdownItem = ({ icon, text, divider, onClick, ...props }) => {
  return (
    <>
      <MenuItem onClick={onClick} {...props}>
        {icon && (
          <>
            <ListItemIcon>
              <SvgIcon component={icon} />
            </ListItemIcon>
            <ListItemText>{text}</ListItemText>
          </>
        )}

        {!icon && text}
      </MenuItem>
      {divider && <Divider />}
    </>
  );
};

export default DropdownItem;
