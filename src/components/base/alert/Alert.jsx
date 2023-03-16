import { useAlert } from "@contexts/AlertContext";
import FRHooks from "frhooks";
import { Check, Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Alert as MuiAlert,
  AlertTitle,
  Button,
  ButtonGroup,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";

const Alert = () => {
  const { alert } = useAlert();
  const { t } = FRHooks.useLang();
  return (
    <Dialog
      open={alert.open}
      aria-describedby={"alert-" + alert.type}
      aria-labelledby={"alert-" + alert.type}
    >
      <MuiAlert severity={alert.type} variant="outlined">
        <AlertTitle>{alert.title || ""}</AlertTitle>
        <Stack direction="column" spacing={0.25}>
          <Typography variant="body2">{alert.message || ""}</Typography>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ButtonGroup size="small">
              {alert.close && (
                <Button
                  disabled={alert.loading}
                  startIcon={alert.close?.icon || <Close />}
                  color="inherit"
                  variant="text"
                  onClick={alert.close.onClick}
                >
                  {alert.close.text || t("cancel")}
                </Button>
              )}

              {alert.confirm && (
                <LoadingButton
                  loading={alert.loading}
                  startIcon={alert.confirm?.icon || <Check />}
                  color={alert.type}
                  variant="text"
                  onClick={alert.confirm?.onClick}
                >
                  {alert.confirm?.text || t("confirm")}
                </LoadingButton>
              )}
            </ButtonGroup>
          </div>
        </Stack>
      </MuiAlert>
    </Dialog>
  );
};

export default Alert;
