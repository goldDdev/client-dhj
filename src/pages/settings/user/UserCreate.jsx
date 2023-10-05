import _ from "lodash";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";
import PhoneFormat from "@components/base/mask/PhoneFormat";

const UserCreate = ({ open, mutation, server, snackbar, table, onOpen }) => {
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
              disabled={mutation.loading}
              label={"No HP"}
              value={mutation.data.phoneNumber || ""}
              onChange={(e) =>
                mutation.setData({ phoneNumber: e.target.value })
              }
              onBlur={async () => {
                const inv = await mutation.validate("phoneNumber");
                if (!inv) {
                  await server.validate("phoneNumber", {
                    phoneNumber: mutation.data.phoneNumber,
                    id: mutation.data.id,
                  });
                }
              }}
              error={mutation.error("phoneNumber")}
              helperText={mutation.message("phoneNumber")}
              InputProps={{
                inputProps: {
                  maxLength: 12,
                },
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
                inputComponent: PhoneFormat,
              }}
            />

            <TextField
              id="empEmail"
              disabled={mutation.loading}
              label={"Alamat Email"}
              value={mutation.data.email || ""}
              onChange={(e) => mutation.setData({ email: e.target.value })}
              onBlur={async () => {
                const inv = await mutation.validate("email");
                if (!inv) {
                  await server.validate("email", {
                    email: mutation.data.email,
                    id: mutation.data.id,
                  });
                }
              }}
              error={mutation.error("email")}
              helperText={mutation.message("email")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
              type="email"
            />
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
              disabled={mutation.processing || !mutation.isValid()}
              variant="contained"
              color="primary"
              onClick={() => {
                const isNew = mutation.isNewRecord;
                const editId = mutation.data.id;

                mutation.post(
                  isNew ? "user.index" : ["user.detail", { id: editId }],
                  {
                    method: mutation.isNewRecord ? "post" : "put",
                    except: mutation.isNewRecord ? ["id"] : [],
                    validation: true,
                    onSuccess: (resp) => {
                      snackbar("Pengguna berhasil ditambahkan");
                      if (isNew) {
                        table.data.unshift(resp.data);
                      } else {
                        const idx = table.data.findIndex(
                          (d) => d.id === editId
                        );
                        table.data[idx] = resp.data;
                      }
                      mutation.clearData();
                      mutation.clearError();
                      onOpen();
                    },
                  }
                );
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

export default UserCreate;
