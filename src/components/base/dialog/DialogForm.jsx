import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const DialogForm = ({ title, content, actions, ...props }) => {
  return (
    <Dialog scroll="paper" fullWidth {...props}>
      <DialogTitle variant="h6">{title}</DialogTitle>
      <DialogContent dividers {...content} />
      <DialogActions {...actions} />
    </Dialog>
  );
};

export default DialogForm;
