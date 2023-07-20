import React from "react";
import { DialogForm, FieldSet, Select } from "@components/base";
import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import * as utils from "@utils/";
import moment from "moment";

const ProjectCreate = ({ open, mutation, onOpen, onSubmit }) => {
  const duration =
    mutation.data.startAt && mutation.data.finishAt
      ? moment(mutation.data.finishAt).diff(mutation.data.startAt, "day")
      : 0;
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Form Proyek"
      maxWidth="md"
      content={{
        children: (
          <Stack spacing={2.5} direction="column">
            <FieldSet disabledDivider>
              <TextField
                fullWidth
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
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "35%",
                    xl: "35%",
                  },
                }}
              />
              <TextField
                fullWidth
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
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "65%",
                    xl: "65%",
                  },
                }}
              />
            </FieldSet>

            <FieldSet disabledDivider>
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Nilai Proyek"
                value={mutation.data.price || 0}
                onChange={(e) =>
                  mutation.setData({
                    price: Number(e.target.value),
                  })
                }
                InputProps={{
                  endAdornment:
                    mutation.loading || mutation.processing ? (
                      <CircularProgress size={20} />
                    ) : null,
                }}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "75%",
                    xl: "75%",
                  },
                }}
              />
              <Box
                width={{
                  xs: "100%",
                  sm: "100%",
                  md: "100%",
                  lg: "25%",
                  xl: "25%",
                }}
              >
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
                  value={mutation.data.status || "DRAFT"}
                  setValue={mutation.setData}
                  onBlur={async () => mutation.validate("status")}
                  error={mutation.error("status")}
                  message={mutation.message("status")}
                />
              </Box>
            </FieldSet>

            <FieldSet
              label="Team"
              stackProps={{ direction: "column", spacing: 2 }}
            >
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Nama Team"
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
                fullWidth
                multiline
                rows={2}
                disabled={mutation.loading || mutation.processing}
                label="Info Kontak Team"
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
                type="number"
                value={mutation.data.latitude || 0}
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
                type="number"
                value={mutation.data.longitude || 0}
                onChange={(e) =>
                  mutation.setData({ longitude: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </FieldSet>

            <FieldSet label="Tanggal Proyek">
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Mulai"
                type="date"
                value={mutation.data.startAt || ""}
                onChange={(e) =>
                  mutation.setData({
                    startAt: e.target.value,
                    targetDate: moment(e.target.value)
                      .add(mutation.data.duration, "day")
                      .format("yyyy-MM-DD"),
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Final"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                value={mutation.data.finishAt || ""}
                onChange={(e) => mutation.setData({ finishAt: e.target.value })}
                inputProps={{ min: mutation.data.startAt }}
              />

              <TextField
                fullWidth
                label="Duration"
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: "40%",
                    xl: "40%",
                  },
                }}
                value={mutation.data.duration}
                inputProps={{ style: { textAlign: "center" } }}
                onChange={(e) => {
                  if (Number.isInteger(+e.target.value)) {
                    mutation.setData({
                      duration: +e.target.value,
                      targetDate: moment(mutation.data.startAt)
                        .add(+e.target.value, "day")
                        .format("yyyy-MM-DD"),
                    });
                  }
                }}
              />

              <TextField
                fullWidth
                disabled
                label="Tanggal Target"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                value={mutation.data.targetDate || ""}
                inputProps={{ min: mutation.data.startAt }}
                onChange={(e) =>
                  mutation.setData({ targetDate: e.target.value })
                }
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
              onClick={onSubmit}
            >
              {mutation.isNewRecord ? "Tambah Baru" : "Simpan Perubahan"}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};

export default ProjectCreate;
