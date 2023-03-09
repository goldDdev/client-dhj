import { Stack, TextField, Button, Box, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DialogForm, FieldSet, Select } from "@components/base";
import * as utils from "@utils/";
import moment from "moment";
import _ from "lodash";

export const Create = ({ open, mutation, snackbar, table, onOpen, route }) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Form Proyek"
      maxWidth="md"
      content={{
        children: (
          <Stack spacing={2.5} direction="column">
            <TextField
              disabled={mutation.loading || mutation.processing}
              label="Nama Proyek"
              value={mutation.data.name || ""}
              onChange={(e) => mutation.setData({ name: e.target.value })}
              onBlur={async () => mutation.validate("name")}
              error={mutation.error("name")}
              helperText={mutation.message("name")}
              InputProps={{
                endAdornment:
                  mutation.loading || mutation.processing ? (
                    <CircularProgress size={20} />
                  ) : null,
              }}
            />

            <FieldSet disabledDivider>
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Nomor SPK"
                value={mutation.data.noSpk || ""}
                onChange={(e) => mutation.setData({ noSpk: e.target.value })}
                onBlur={async () => mutation.validate("noSpk")}
                error={mutation.error("noSpk")}
                helperText={mutation.message("noSpk")}
                InputProps={{
                  endAdornment:
                    mutation.loading || mutation.processing ? (
                      <CircularProgress size={20} />
                    ) : null,
                }}
                sx={{ width: "75%" }}
              />

              <Box width="25%">
                <Select
                  fullWidth
                  name="status"
                  label="Status"
                  menu={[
                    ...Object.entries(utils.projectStatus).map(([k, v]) => ({
                      text: v,
                      value: k,
                    })),
                  ]}
                  sx={{ width: "100%" }}
                  value={mutation.data.status}
                  setValue={mutation.setData}
                  onBlur={async () => mutation.validate("status")}
                  error={mutation.error("status")}
                  message={mutation.message("status")}
                />
              </Box>
            </FieldSet>

            <FieldSet
              label="Informasi Pemberi Proyek"
              stackProps={{ direction: "column", spacing: 2 }}
            >
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Perusahaan"
                value={mutation.data.companyName || ""}
                onChange={(e) =>
                  mutation.setData({ companyName: e.target.value })
                }
                onBlur={async () => mutation.validate("companyName")}
                error={mutation.error("companyName")}
                helperText={mutation.message("companyName")}
                InputProps={{
                  endAdornment:
                    mutation.loading || mutation.processing ? (
                      <CircularProgress size={20} />
                    ) : null,
                }}
              />

              <TextField
                multiline
                rows={2}
                disabled={mutation.loading || mutation.processing}
                fullWidth
                label="Kontak"
                value={mutation.data.contact || ""}
                onChange={(e) => mutation.setData({ contact: e.target.value })}
                sx={{ width: "100%" }}
              />
            </FieldSet>

            <FieldSet
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
                multiline
                rows={2}
                disabled={mutation.loading || mutation.processing}
                fullWidth
                label="Lokasi"
                value={mutation.data.location || ""}
                onChange={(e) => mutation.setData({ location: e.target.value })}
                sx={{ width: "100%", mb: 2 }}
              />

              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Latitude Koordinat"
                sx={{ width: "49%" }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                type="number"
                value={mutation.data.latitude}
                onChange={(e) => mutation.setData({ latitude: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Longitude Koordinat"
                sx={{ width: "49%" }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                type="number"
                value={mutation.data.longitude}
                onChange={(e) =>
                  mutation.setData({ longitude: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </FieldSet>

            <FieldSet label="Tanggal Proyek">
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Mulai"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                value={mutation.data.startAt}
                onChange={(e) => mutation.setData({ startAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Berakhir"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                value={mutation.data.finishAt}
                onChange={(e) => mutation.setData({ finishAt: e.target.value })}
              />

              <TextField
                disabled
                label="Duration"
                type="number"
                sx={{ width: "25%" }}
                value={moment(mutation.data.finishAt).diff(
                  mutation.data.startAt,
                  "day"
                )}
                inputProps={{ style: { textAlign: "center" } }}
              />
            </FieldSet>
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
              disabled={mutation.processing || mutation.loading}
              disableElevation
              variant="contained"
              color="primary"
              onClick={() => {
                mutation.post(route().project("index").link(), {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: [].concat(mutation.isNewRecord ? ["id"] : []),
                  validation: true,
                  onSuccess: (resp) => {
                    snackbar(`Proyek Berhasil Ditambahkan`);
                    onOpen();
                    if (table && mutation.isNewRecord) {
                      table.data.unshift(resp.data);
                    }
                  },
                });
              }}
            >
              {mutation.isNewRecord ? "Tambah Baru" : "Simpan Perubahan"}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
