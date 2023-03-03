import { Button, Tooltip } from "@mui/material";

export default ({ title, ...props }) => {
  return (
    <Tooltip title={title}>
      <Button {...props} />
    </Tooltip>
  );
};
