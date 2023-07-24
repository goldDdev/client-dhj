import React from "react";
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
  const id = React.useId();
  return (
    <>
      <TextField
        InputLabelProps={{
          htmlFor: id,
        }}
        inputProps={{ id: id }}
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
      {message !== "" ? (
        <FormHelperText error={message !== ""}>{message}</FormHelperText>
      ) : null}
    </>
  );
};

export default Select;

Select.defaultProps = {
  label: "",
  menu: [],
  message: "",
};
