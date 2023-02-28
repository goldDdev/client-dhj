import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const AlertDialog = ({
  loading,
  open,
  variant,
  title,
  message,
  textConfirm,
  textCancel,
  onClose,
  onConfirm,
  whenClose,
  whenConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (onClose) onClose();
        if (whenClose) whenClose();
      }}
      maxWidth="lg"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Alert
        severity="success"
        variant="outlined"
        action={
          <>
            <Button
              size="small"
              variant="text"
              color={variant}
              fullWidth
              onClick={() => {
                if (onClose) onClose();
                if (whenClose) whenClose();
              }}
            >
              {textCancel}
            </Button>
            <LoadingButton
              size="small"
              loading={loading}
              variant="text"
              color={variant}
              fullWidth
              onClick={() => {
                if (onConfirm) onConfirm();
                if (whenConfirm) whenConfirm();
              }}
            >
              {textConfirm}
            </LoadingButton>
          </>
        }
      >
        <AlertTitle>Success</AlertTitle>
        This is an error alert — <strong>check it out!</strong>
      </Alert>

      {/* <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          color={variant}
          fullWidth
          onClick={() => {
            if (onClose) onClose();
            if (whenClose) whenClose();
          }}
        >
          {textCancel}
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color={variant}
          fullWidth
          onClick={() => {
            if (onConfirm) onConfirm();
            if (whenConfirm) whenConfirm();
          }}
        >
          {textConfirm}
        </LoadingButton>
      </DialogActions> */}
    </Dialog>
  );
};

export default AlertDialog;

AlertDialog.defaultProps = {
  loading: false,
  open: false,
  variant: "primary",
  textCancel: "Cancel",
  textConfirm: "Confirm",
};
