import { DialogForm, FieldSet } from "@components/base";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";

export default ({ open, onClose, mutation, onSubmit }) => {
  return (
    <DialogForm
      maxWidth="xs"
      open={open}
      title={"Profil"}
      onClose={onClose}
      content={{
        children: (
          <Stack direction="column" spacing={2}>
            <TextField
              label="Nama"
              size="small"
              value={mutation.data.name || ""}
              onChange={(e) => mutation.setData({ name: e.target.value })}
              error={mutation.error("name")}
              helperText={mutation.message("name")}
            />

            <TextField
              disabled
              label="Email"
              size="small"
              value={mutation.data.email || ""}
              onChange={(e) => mutation.setData({ email: e.target.value })}
              error={mutation.error("email")}
              helperText={mutation.message("email")}
            />

            <TextField
              label="No HP"
              size="small"
              value={mutation.data.phoneNumber || ""}
              onChange={(e) =>
                mutation.setData({ phoneNumber: e.target.value })
              }
              error={mutation.error("phoneNumber")}
              helperText={mutation.message("phoneNumber")}
            />

            <FieldSet label="Kata Sandi">
              <TextField
                label="Ubah Kata Sandi"
                size="small"
                type="password"
                onChange={(e) => mutation.setData({ password: e.target.value })}
                placeholder="Masukkan kata sandi baru"
                value={mutation.data.password || ""}
                error={mutation.error("password")}
                helperText={mutation.message("password")}
              />
            </FieldSet>
          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onClose}>
              Keluar
            </Button>
            <LoadingButton
              loading={mutation.processing}
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
