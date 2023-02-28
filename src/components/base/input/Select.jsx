import { FormHelperText, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Select = ({
  fullWidth,
  value,
  menu,
  setValue,
  message,
  ...selectProps
}) => {
  return (
    <>
      <TextField
        select
        value={value}
        onChange={
          setValue
            ? (e) => {
                setValue({ [e.target.name]: e.target.value });
              }
            : undefined
        }
        {...selectProps}
      >
        {menu.map(({ text, ..._menu }, i) => (
          <MenuItem {..._menu} key={`select-${i}`}>
            {text}
          </MenuItem>
        ))}
      </TextField>
      <FormHelperText error={message !== ""}>{message}</FormHelperText>
    </>
  );
};

export default Select;

Select.defaultProps = {
  label: "",
  menu: [],
};
