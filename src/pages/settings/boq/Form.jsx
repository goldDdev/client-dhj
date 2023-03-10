import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import _ from "lodash";

export const BoqForm = ({ open, t, r, mutation, snackbar, table, onOpen, onSubmit }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={t(["form","boq"])}
      content={{
        children: (
          <Stack spacing={2}>
            <TextField
              id="empName"
              disabled={mutation.loading}
              label={t("name")}
              value={mutation.data.name || ""}
              onChange={(e) => mutation.setData({ name: e.target.value })}
              onBlur={async () => mutation.validate("name")}
              error={mutation.error("name")}
              helperText={mutation.message("name")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />
            <TextField
              id="empUnit"
              disabled={mutation.loading}
              label={t("unit")}
              value={mutation.data.typeUnit || ""}
              onChange={(e) => mutation.setData({ typeUnit: e.target.value })}
              onBlur={async () => mutation.validate("typeUnit")}
              error={mutation.error("typeUnit")}
              helperText={mutation.message("typeUnit")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />

          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onOpen}>
              {t("cancel")}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={mutation.processing}
              disabled={mutation.processing}
              onClick={onSubmit}
            >
              {t("save")}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
