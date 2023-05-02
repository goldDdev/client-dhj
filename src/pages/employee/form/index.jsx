import _ from "lodash";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";

export const Create = ({ open, t, mutation, onOpen, onSubmit }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={"Form Karyawan"}
      content={{
        children: (
          <Stack spacing={2}>
            <TextField
              id="empName"
              disabled={mutation.loading}
              label="Nama"
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
              label={"No. ID Karyawan"}
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
              label={"No HP"}
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
              label={"Role"}
              name="role"
              menu={utils.workerMobileTypes.map((v) => ({
                text: utils.typesLabel(v),
                value: v,
              }))}
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
              Keluar
            </Button>
            <LoadingButton
              loading={mutation.processing}
              disabled={mutation.processing}
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Simpan
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
