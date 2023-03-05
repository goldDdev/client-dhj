import { Stack, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";
import _ from "lodash";

export const Create = ({ open, t, r, mutation, snackbar, table, onOpen }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={t(["form","project"])}
      content={{
        children: (
          <Stack spacing={2}>
            <TextField
              id="empName"
              disabled={mutation.loading}
              label="Nama Proyek"
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
              disabled={mutation.loading}
              id="location"
              label="Nama Lokasi"
            />
            <TextField
              disabled={mutation.loading}
              id="latitude"
              label="Latitude Koordinat"
            />
            <TextField
              disabled={mutation.loading}
              id="longitude"
              label="Longitude Koordinat"
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
              loading={mutation.processing}
              disabled={mutation.processing}
              variant="contained"
              color="primary"
              onClick={() => {
                mutation.post("/employee", {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: mutation.isNewRecord ? ["id"] : [],
                  validation: true,
                  onSuccess: (resp) => {
                    snackbar(t("employeeSuccessCreate"));
                    table.data.unshift(resp.data);
                    mutation.clearData();
                    mutation.clearError();
                  },
                });
              }}
            >
              {t("save")}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
