import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const DialogForm = ({ title, content, actions, ...props }) => {
  return (
    <Dialog scroll="paper" fullWidth {...props}>
      <DialogTitle variant="h6">
        {title}
        {props.onClose ? (
          <IconButton
            aria-label="close"
            onClick={props.onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers {...content} />
      {actions ? <DialogActions {...actions} /> : null}
    </Dialog>
  );
};

export default DialogForm;
