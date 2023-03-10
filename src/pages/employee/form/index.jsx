import * as MUI from "@mui/material";
import * as BASE from "@components/base";
import * as utils from "@utils/";
import * as icon from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import _ from "lodash";

export const Create = ({ open, t, r, mutation, snackbar, table, onOpen }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={t("titleEmployeeDialog")}
      content={{
        children: (
          <MUI.Stack spacing={2}>
            <MUI.TextField
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
                  <MUI.CircularProgress size={20} />
                ) : null,
              }}
            />

            <MUI.TextField
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
                  <MUI.CircularProgress size={20} />
                ) : null,
              }}
            />

            <MUI.TextField
              id="empPN"
              disabled={mutation.loading}
              label={t("phoneNumber")}
              value={mutation.data.phoneNumber || ""}
              onChange={(e) =>
                mutation.setData({ phoneNumber: +e.target.value })
              }
              onBlur={async () => mutation.validate("phoneNumber")}
              error={mutation.error("phoneNumber")}
              helperText={mutation.message("phoneNumber")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <MUI.CircularProgress size={20} />
                ) : null,
              }}
              inputProps={{
                maxLength: 12,
              }}
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
          </MUI.Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <MUI.Button variant="outlined" onClick={onOpen}>
              {t("cancel")}
            </MUI.Button>
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
