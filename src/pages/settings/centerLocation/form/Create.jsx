import _ from "lodash";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";

const Create = ({ open, t, mutation, onOpen, onSubmit }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={"Form Center Lokasi"}
      content={{
        children: (
          <Stack spacing={2}>
            <TextField
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

            <BASE.FieldSet
              label="Lokasi Proyek"
              stackProps={{
                flexWrap: "wrap",
                sx: {
                  "& >:not(style)+:not(style)": {
                    marginLeft: 0,
                  },
                },
              }}
            >
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Latitude Koordinat"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "49%",
                    xl: "49%",
                  },
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                value={mutation.data.latitude || ""}
                onChange={(e) => mutation.setData({ latitude: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Longitude Koordinat"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "49%",
                    xl: "49%",
                  },
                }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                value={mutation.data.longitude || ""}
                onChange={(e) =>
                  mutation.setData({ longitude: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </BASE.FieldSet>

            <TextField
              multiline
              rows={2}
              disabled={mutation.loading || mutation.processing}
              fullWidth
              label="Desskripsi"
              value={mutation.data.description || ""}
              onChange={(e) =>
                mutation.setData({ description: e.target.value })
              }
              sx={{ width: "100%", mb: 2 }}
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

export default Create;
