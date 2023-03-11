import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";
import _ from "lodash";
import FRHooks from "frhooks";

export const Create = ({ open, t, r, mutation, snackbar, table, onOpen }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={t("titleEmployeeDialog")}
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
              id="empCard"
              disabled={mutation.loading}
              label={t("cardID")}
              value={mutation.data.cardID || ""}
              onChange={(e) => mutation.setData({ cardID: e.target.value })}
              onBlur={async () => mutation.validate("cardID")}
              error={mutation.error("cardID")}
              helperText={mutation.message("cardID")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />

            <TextField
              id="empPN"
              type="number"
              disabled={mutation.loading}
              label={t("phoneNumber")}
              value={mutation.data.phoneNumber || ""}
              onChange={(e) =>
                mutation.setData({ phoneNumber: e.target.value })
              }
              onBlur={async () => mutation.validate("phoneNumber")}
              error={mutation.error("phoneNumber")}
              helperText={mutation.message("phoneNumber")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
              inputProps={{
                maxLength: 12,
              }}
            />

            <TextField
              id="empEmail"
              disabled={mutation.loading}
              label={"Alamat Email"}
              value={mutation.data.email || ""}
              onChange={(e) => mutation.setData({ email: e.target.value })}
              onBlur={async () => mutation.validate("email")}
              error={mutation.error("email")}
              helperText={mutation.message("email")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
              type="email"
            />

            <BASE.Select
              id="empRole"
              label={t("role")}
              name="role"
              menu={utils.types.map((v) => ({ text: t(v), value: v }))}
              value={mutation.data.role === "" ? "WORKER" : mutation.data.role}
              setValue={mutation.setData}
              error={mutation.error("role")}
              helperText={mutation.message("role")}
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
                const isNew = mutation.isNewRecord;
                const editId = mutation.data.id;
                const route = isNew ? FRHooks.apiRoute().employee("index") : FRHooks.apiRoute().employee("detail", { id: editId })
                mutation.post(route, {
                  method: isNew ? "post" : "put",
                  except: isNew ? ["id"] : [],
                  validation: true,
                  onSuccess: (resp) => {
                    snackbar(t("commonSuccessCreate"));
                    if (isNew) {
                      table.data.unshift(resp.data);
                    } else {
                      const idx = table.data.findIndex(d => d.id === editId)
                      table.data[idx] = resp.data;
                    }
                    mutation.clearData();
                    mutation.clearError();
                    onOpen();
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
