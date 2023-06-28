import { IconButton, Tooltip } from "@mui/material";

export default ({ title, ...props }) => {
  return (
    <Tooltip title={title}>
      <IconButton {...props} />
    </Tooltip>
  );
};
