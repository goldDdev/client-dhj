import FRHooks from "frhooks";
import _ from "lodash";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";

export const UserForm = ({ open, mutation, snackbar, table, onOpen }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={"Form Pengguna"}
      content={{
        children: (
          <Stack spacing={2}>
            <BASE.Select
              id="empRole"
              label="Role"
              name="role"
              menu={utils.workerWebTypes.map((v) => ({
                text: utils.typesLabel(v),
                value: v,
              }))}
              value={mutation.data.role === "" ? "ADMIN" : mutation.data.role}
              setValue={mutation.setData}
              error={mutation.error("role")}
              helperText={mutation.message("role")}
            />
            
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

            {/* <TextField
              type="password"
              id="password"
              label="Password"
              disabled={mutation.loading}
            />
            <TextField
              type="password"
              id="password"
              label="Konfirmasi Password"
              disabled={mutation.loading}
            /> */}
          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onOpen}>
              Batal
            </Button>
            <LoadingButton
              loading={mutation.processing}
              disabled={mutation.processing}
              variant="contained"
              color="primary"
              onClick={() => {
                const isNew = mutation.isNewRecord;
                const editId = mutation.data.id;
                const route = isNew
                  ? FRHooks.apiRoute().user("index")
                  : FRHooks.apiRoute().user("detail", { id: editId });
                mutation.post(route.link(), {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: mutation.isNewRecord ? ["id"] : [],
                  validation: true,
                  onSuccess: (resp) => {
                    snackbar("Pengguna berhasil ditambahkan");
                    if (isNew) {
                      table.data.unshift(resp.data);
                    } else {
                      const idx = table.data.findIndex((d) => d.id === editId);
                      table.data[idx] = resp.data;
                    }
                    mutation.clearData();
                    mutation.clearError();
                    onOpen();
                  },
                });
              }}
            >
              {mutation.isNewRecord ? "Tambah Pengguna" : "Simpan Perubahan"}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
