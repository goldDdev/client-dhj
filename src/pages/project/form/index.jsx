import React from "react";
import {
  Stack,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";
import {
  Add,
  Close,
  ExpandMore,
  MoreVert,
  PersonAddAlt,
  Search,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { BasicDropdown, DialogForm, FieldSet, Select } from "@components/base";
import { SimpleList } from "@components/base/list";
import * as utils from "@utils/";
import moment from "moment";
import _ from "lodash";
import * as Filter from "../filter";
import apiRoute from "@services/apiRoute";

export const Create = ({ open, mutation, onOpen, onSubmit }) => {
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

export const ListWorker = ({
  onAdd,
  onRemove,
  onOpen,
  workers,
  selectedWorkers,
  loading,
  searchLoading,
  addWorkerLoading,
  open,
  searchWorker,
}) => {
  return (
    <Paper elevation={0} variant="outlined">
      <Stack
        p={1.5}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Daftar Pekerja
        </Typography>

        <Button
          variant="text"
          startIcon={open ? <Close /> : <PersonAddAlt />}
          disableElevation
          onClick={onOpen}
        >
          {open ? "Tutup" : "Tambah Pekerja"}
        </Button>
      </Stack>

      <Divider />

      <Stack direction="row">
        {open ? (
          <Stack direction="column" flex={1} p={1}>
            <TextField
              fullWidth
              placeholder="Cari Pekerja"
              InputProps={{
                startAdornment: <Search />,
              }}
              onChange={searchWorker}
            />

            <SimpleList
              dense
              loading={searchLoading}
              data={workers.map((v, i) => ({
                primary: v.name,
                primaryTypographyProps: { variant: "subtitle2" },
                secondary: utils.typesLabel(v.role),
                secondaryTypographyProps: { variant: "body2" },
                itemProps: {
                  divider: workers.length - 1 !== i,
                  dense: true,
                  secondaryAction: addWorkerLoading.some(
                    (_v) => _v === v.id
                  ) ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IconButton size="small" onClick={onAdd(v)}>
                      <Add fontSize="small" />
                    </IconButton>
                  ),
                },
              }))}
            />
          </Stack>
        ) : null}

        {open ? <Divider flexItem orientation="vertical" /> : null}

        <SimpleList
          dense
          sx={{ flex: 1, maxHeight: 720, overflow: "scroll" }}
          loading={loading}
          data={selectedWorkers.map((v, i) => ({
            primary: v.name,
            primaryTypographyProps: { variant: "subtitle2" },
            secondary: utils.typesLabel(v.role),
            secondaryTypographyProps: { variant: "body2" },
            sx: { m: 0 },
            iconProps:
              v.role === "MANDOR"
                ? {
                    sx: {
                      justifyContent: "center",
                    },
                    children: (
                      <IconButton size="small">
                        <ExpandMore />
                      </IconButton>
                    ),
                  }
                : undefined,
            itemProps: {
              disableGutters: v.role === "MANDOR",
              divider: selectedWorkers.length - 1 !== i,
              dense: true,
              sx: { m: 0, "& .MuiListItemSecondaryAction-root ": { right: 0 } },
              secondaryAction: addWorkerLoading.some((_v) => _v === v.id) ? (
                <CircularProgress size={20} />
              ) : (
                <BasicDropdown
                  type="icon"
                  menu={[
                    {
                      text: "Hapus",
                      onClick: onRemove(v),
                      disabled:
                        v.role === "MANDOR" &&
                        selectedWorkers.filter((_w) => _w.parentId === v.id)
                          .length > 0,
                    },
                  ]}
                  label={<MoreVert fontSize="small" />}
                  size="small"
                />
              ),
            },
          }))}
        />
      </Stack>
    </Paper>
  );
};

export const EventCreate = ({
  open,
  mutation,
  snackbar,
  table,
  onOpen,
  route,
  type,
}) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Form Event"
      maxWidth="md"
      content={{
        children: (
          <Stack spacing={1.5} direction="column">
            {type === "full" ? (
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Nama Event"
                value={mutation.data.title || ""}
                onChange={(e) => mutation.setData({ title: e.target.value })}
                onBlur={async () => mutation.validate("title")}
                error={mutation.error("title")}
                helperText={mutation.message("title")}
                InputProps={{
                  endAdornment:
                    mutation.loading || mutation.processing ? (
                      <CircularProgress size={20} />
                    ) : null,
                }}
              />
            ) : null}

            {type === "full" ? (
              <FieldSet disabledDivider label="Tanggal Plan">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.datePlan}
                  onChange={(e) =>
                    mutation.setData({
                      datePlan: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("datePlan")}
                  error={mutation.error("datePlan")}
                  helperText={mutation.message("datePlan")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={type === "full" ? "Waktu" : "Waktu Aktual"}
                  value={
                    mutation.data[
                      type === "full" ? "timePlan" : "actualTime"
                    ] || ""
                  }
                  onChange={(e) =>
                    mutation.setData({
                      [type === "full" ? "timePlan" : "actualTime"]:
                        e.target.value,
                    })
                  }
                  onBlur={async () =>
                    mutation.validate(
                      type === "full" ? "timePlan" : "actualTime"
                    )
                  }
                  error={mutation.error(
                    type === "full" ? "timePlan" : "actualTime"
                  )}
                  helperText={mutation.message(
                    type === "full" ? "timePlan" : "actualTime"
                  )}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "revise1" ? (
              <FieldSet disabledDivider label="Revise 1">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.revise1}
                  onChange={(e) =>
                    mutation.setData({
                      revise1: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("revise1")}
                  error={mutation.error("revise1")}
                  helperText={mutation.message("revise1")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.reviseTime1}
                  onChange={(e) =>
                    mutation.setData({
                      reviseTime1: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("reviseTime1")}
                  error={mutation.error("reviseTime1")}
                  helperText={mutation.message("reviseTime1")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "revise2" ? (
              <FieldSet disabledDivider label="Revise 2">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.revise2}
                  onChange={(e) =>
                    mutation.setData({
                      revise2: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("revise2")}
                  error={mutation.error("revise2")}
                  helperText={mutation.message("revise2")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.reviseTime2}
                  onChange={(e) =>
                    mutation.setData({
                      reviseTime2: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("reviseTime2")}
                  error={mutation.error("reviseTime2")}
                  helperText={mutation.message("reviseTime2")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "actual" ? (
              <FieldSet disabledDivider label="Tanggal Aktual">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.actualDate || ""}
                  onChange={(e) =>
                    mutation.setData({
                      actualDate: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("actualDate")}
                  error={mutation.error("actualDate")}
                  helperText={mutation.message("actualDate")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.actualTime || ""}
                  onChange={(e) =>
                    mutation.setData({
                      actualTime: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("actualTime")}
                  error={mutation.error("actualTime")}
                  helperText={mutation.message("actualTime")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}
            <FieldSet
              label="Status Event"
              stackProps={{
                direction: "row",
                spacing: 1,
                justifyContent: "flex-start",
              }}
            >
              {Object.entries(utils.komStatus).map(([k, v]) => (
                <Filter.ChipKom
                  disableElevation
                  size="small"
                  key={k}
                  status={k}
                  color={mutation.data.status === k ? "primary" : "inherit"}
                  variant={
                    mutation.data.status === k ? "contained" : "outlined"
                  }
                  onClick={() => {
                    mutation.setData({ status: k });
                  }}
                />
              ))}
            </FieldSet>

            {false ? (
              <FieldSet
                label="Deskripsi"
                stackProps={{ direction: "column", spacing: 2 }}
              >
                <div id="description"></div>
                <TextField
                  fullWidth
                  id="description"
                  multiline
                  rows={2}
                  disabled={mutation.loading || mutation.processing}
                  value={mutation.data.description || ""}
                  onChange={(e) =>
                    mutation.setData({ description: e.target.value })
                  }
                  placeholder="Tulis deskripsi disini"
                  sx={{ width: "100%" }}
                />
              </FieldSet>
            ) : null}
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
                mutation.post(route().project("kom").link(), {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: [].concat(mutation.isNewRecord ? ["id"] : []),
                  validation: true,
                  onSuccess: ({ data }) => {
                    snackbar(`Event Berhasil Ditambahkan`);
                    onOpen();
                    if (table && mutation.isNewRecord) {
                      table.add(data, "start");
                    } else {
                      table.update((v) => v.id === mutation.data.id, data);
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

export const BOQCreate = ({
  trigger,
  table,
  onOpen,
  list,
  mutation,
  route,
  setTrigger,
}) => (
  <DialogForm
    open={trigger.form}
    onClose={onOpen}
    title="Cari BOQ"
    maxWidth="sm"
    content={{
      sx: { px: 0, height: "480px" },
      children: (
        <Stack spacing={1.5} direction="column">
          <TextField
            fullWidth
            InputProps={{ startAdornment: <Search /> }}
            placeholder="Cari disini"
            value={table.getQuery("name", "")}
            onChange={(e) => table.setQuery({ name: e.target.value })}
            sx={{ px: 2 }}
          />

          <List dense sx={{ maxHeight: "480px", overflow: "auto" }}>
            {table.loading ? (
              <ListItem>
                <Skeleton width="100%" />{" "}
              </ListItem>
            ) : null}
            {!table.loading && !table.isEmpty
              ? table.data.map((v, index) => (
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <IconButton
                        size="small"
                        onClick={() => {
                          const id = v.id;
                          mutation.merge({ boqId: id });
                          mutation.post(apiRoute.project.boq, {
                            except: ["id"],
                            onBeforeSend: () => {
                              table.destroy((_v) => _v.id === id);
                              setTrigger((state) => ({
                                ...state,
                                postLoading: state.postLoading.concat([v.id]),
                              }));
                              list.add({
                                id: list.length === 0 ? 0 : list.length - 1,
                                name: "loading",
                                boqId: id,
                                typeUnit: "loading",
                                unit: 0,
                                updateAt: new Date().toLocaleString(),
                              });
                            },
                            onSuccess: ({ data }) => {
                              list.update((_v) => _v.boqId === id, data);
                            },
                            onAlways: () => {
                              setTrigger((state) => ({
                                ...state,
                                postLoading: state.postLoading.filter(
                                  (_v) => _v !== id
                                ),
                              }));
                            },
                          });
                        }}
                      >
                        <Add fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={v.name} secondary={v.typeUnit} />
                  </ListItem>
                ))
              : null}

            {!table.loading && table.isEmpty ? (
              <ListItem alignItems="center" divider>
                <ListItemText
                  primary="Oops data yang anda cari mungkin belum tersedia."
                  primaryTypographyProps={{ align: "center" }}
                  secondary="Atau anda dapat mencoba ketikkan pencarian lain"
                  secondaryTypographyProps={{ align: "center" }}
                />
              </ListItem>
            ) : null}
          </List>
        </Stack>
      ),
    }}
  />
);

export const BOQCreateV2 = ({ trigger, onOpen, mutation, onSubmit }) => (
  <DialogForm
    open={trigger.form}
    onClose={onOpen}
    title="Tambah BOQ"
    maxWidth="sm"
    content={{
      children: (
        <Stack spacing={2} direction="column">
          <TextField
            label="Nama"
            value={mutation.data.name || ""}
            onChange={(e) => mutation.setData({ name: e.target.value })}
            error={mutation.error("name")}
            helperText={mutation.message("name")}
          />

          <FieldSet disabledDivider>
            <TextField
              label="Satuan"
              value={mutation.data.typeUnit || ""}
              onChange={(e) => mutation.setData({ typeUnit: e.target.value })}
              error={mutation.error("typeUnit")}
              helperText={mutation.message("typeUnit")}
            />

            <TextField
              label="Unit"
              value={mutation.data.unit}
              onChange={(e) => {
                if (Number.isInteger(+e.target.value)) {
                  mutation.setData({ unit: +e.target.value });
                }
              }}
              error={mutation.error("unit")}
              helperText={mutation.message("unit")}
            />
          </FieldSet>

          <TextField
            label="Harga"
            value={mutation.data.price}
            onChange={(e) => {
              if (Number.isInteger(+e.target.value)) {
                mutation.setData({ price: +e.target.value });
              }
            }}
            error={mutation.error("price")}
            helperText={mutation.message("price")}
          />

          <TextField
            label="Jumlah Harga"
            value={mutation.data.totalPrice}
            onChange={(e) => {
              if (Number.isInteger(+e.target.value)) {
                mutation.setData({ totalPrice: +e.target.value });
              }
            }}
            error={mutation.error("totalPrice")}
            helperText={mutation.message("totalPrice")}
          />

          <Select
            label={"Tipe"}
            name="type"
            menu={[
              { text: "Pilih Tipe", value: "00" },
              ...utils.boqTypes.map((v) => ({
                text: v,
                value: v,
              })),
            ]}
            value={mutation.data.type || "00"}
            onChange={(e) => {
              mutation.setData({
                type: e.target.value === "00" ? null : e.target.value,
              });
            }}
            error={mutation.error("type")}
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

export const BOQImport = ({
  data,
  loading,
  trigger,
  onOpen,
  onUpload,
  onSubmit,
  setJsonData,
  filename,
}) => {
  const failData = data.filter((v) =>
    !v.name ? true : !v.typeUnit ? true : !v.unit ? true : false
  );

  return (
    <DialogForm
      open={trigger.import}
      onClose={onOpen}
      title="Import BOQ"
      maxWidth="sm"
      content={{
        children: (
          <Stack spacing={1.5} direction="column">
            <TextField
              type="file"
              onChange={onUpload}
              error={failData.length > 0}
              helperText={
                failData.length > 0 ? "Mohon untuk melengkapi data." : ""
              }
            />

            {filename ? (
              <Typography gutterBottom>
                {filename} ({data.length})
              </Typography>
            ) : null}

            {failData.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        component="th"
                        padding="checkbox"
                        align="center"
                      >
                        Row
                      </TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell align="center">Satuan</TableCell>
                      <TableCell align="center">Unit</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {failData.map((val, r) => {
                      return (
                        <TableRow key={r}>
                          <TableCell align="center">{val.row + 1}</TableCell>
                          <TableCell>{val.name || "Kosong"}</TableCell>

                          <TableCell align="center">
                            {val.typeUnit || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {val.unit || "Kosong"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
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
              disabled={data.length === 0 || failData.length > 0}
              loading={loading}
              disableElevation
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Import BOQ
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};

export const WorkerCreate = ({
  trigger,
  onOpen,
  onAddMember,
  searchWorkers,
}) => (
  <DialogForm
    open={trigger.openWorker}
    onClose={onOpen("")}
    title="Cari Pekerja"
    maxWidth="sm"
    content={{
      sx: { px: 0, height: "480px" },
      children: (
        <Stack spacing={1.5} direction="column">
          <TextField
            fullWidth
            InputProps={{ startAdornment: <Search /> }}
            placeholder="Cari disini"
            value={searchWorkers.getQuery("name", "")}
            onChange={(e) => searchWorkers.setQuery({ name: e.target.value })}
            sx={{ px: 2 }}
          />

          <List dense sx={{ maxHeight: "480px", overflow: "auto" }}>
            {searchWorkers.loading ? (
              <ListItem>
                <Skeleton width="100%" />{" "}
              </ListItem>
            ) : null}

            {!searchWorkers.loading && !searchWorkers.isEmpty
              ? searchWorkers.data.map((v, index) => (
                  <ListItem
                    key={index}
                    divider
                    secondaryAction={
                      <IconButton size="small" onClick={onAddMember(v)}>
                        <Add fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={v.name}
                      secondary={utils.typesLabel(v.role)}
                    />
                  </ListItem>
                ))
              : null}

            {!searchWorkers.loading && searchWorkers.isEmpty ? (
              <ListItem alignItems="center" divider>
                <ListItemText
                  primary="Oops data yang anda cari mungkin belum tersedia."
                  primaryTypographyProps={{ align: "center" }}
                  secondary="Atau anda dapat mencoba ketikkan pencarian lain"
                  secondaryTypographyProps={{ align: "center" }}
                />
              </ListItem>
            ) : null}
          </List>
        </Stack>
      ),
    }}
  />
);

export const ProgresUpdate = ({
  loading,
  open,
  boq,
  current,
  onOpen,
  onSubmit,
  onChange,
}) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Form Progres"
      maxWidth="xs"
      content={{
        children: (
          <Stack spacing={1.5} direction="column">
            <Typography>
              {boq.name} ({boq.typeUnit})
            </Typography>
            <TextField
              fullWidth
              InputLabelProps={{ shrink: true }}
              label="Unit"
              value={current.progres || 0}
              onChange={onChange}
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              type="number"
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
              loading={loading}
              disableElevation
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Simpan Perubahan
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};

export const UpdateOvertime = ({ open, mutation, onOpen, data, onSubmit }) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Ubah Lembur"
      maxWidth="md"
      content={{
        sx: { p: 0 },
        children: (
          <Stack spacing={0} direction="row">
            {data.type === "TEAM" ? (
              <SimpleList
                dense
                sx={{ height: 480, overflow: "scroll", width: "25%" }}
                loading={false}
                data={((data && data.employees) || []).map((v, i) => ({
                  primary: v.name,
                  secondary: utils.typesLabel(v.role),
                  itemProps: {
                    divider: ((data && data.employees) || []).length - 1 !== i,
                    sx: { py: 0, px: 1 },
                  },
                }))}
              />
            ) : null}

            {data.type === "TEAM" ? (
              <Divider flexItem orientation="vertical" />
            ) : null}

            <Stack direction="column" flexGrow={1}>
              <List dense>
                {data.type === "TEAM" ? null : (
                  <ListItem divider sx={{ py: 0, px: 1 }}>
                    <ListItemText
                      primary="Nama"
                      secondary={`${
                        data.employeeName || "-"
                      } - ${utils.typesLabel(data.employeeRole)}`}
                    />
                  </ListItem>
                )}

                <ListItem divider sx={{ py: 0, px: 1 }}>
                  <ListItemText
                    primary="Tanggal"
                    secondary={
                      data.absentAt
                        ? moment(data.absentAt).format("DD-MM-yyyy")
                        : "-"
                    }
                  />
                </ListItem>

                <ListItem divider sx={{ py: 0, px: 1 }}>
                  <ListItemText
                    primary="Durasi"
                    secondary={`${
                      data.durationOvertime === 0
                        ? 0
                        : data.overtimeDuration / 60
                    } Jam`}
                  />
                </ListItem>

                <ListItem divider sx={{ py: 0, px: 1 }}>
                  <ListItemText
                    primary="Biaya"
                    secondary={`${
                      data.durationOvertime === 0
                        ? 0
                        : data.overtimeDuration / 60
                    } Jam X ${utils.formatCurrency(
                      data.overtimePrice || 0
                    )} = ${utils.formatCurrency(data.totalEarn)}`}
                  />
                </ListItem>

                <ListItem divider sx={{ py: 0, px: 1 }}>
                  <ListItemText
                    primary="Dajukan Oleh"
                    secondary={`${data.requestName || "-"} - ${utils.typesLabel(
                      data.requestRole
                    )}`}
                  />
                </ListItem>

                <ListItem divider sx={{ py: 0, px: 1 }}>
                  <ListItemText
                    primary="Dikonfirmasi Oleh"
                    secondary={`${data.actionEmployee?.name || "-"} - ${
                      data.actionEmployee
                        ? utils.typesLabel(data.actionEmployee?.role)
                        : ""
                    }`}
                  />
                </ListItem>
              </List>

              <Box p={0.5}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ borderBottom: 0 }} align="right">
                        <Select
                          fullWidth
                          variant="standard"
                          name="duration"
                          label="Durasi"
                          menu={[
                            { text: "1 Jam", value: 60 },
                            { text: "2 Jam", value: 120 },
                            { text: "3 Jam", value: 180 },
                            { text: "4 Jam", value: 240 },
                            { text: "5 Jam", value: 300 },
                          ]}
                          value={mutation.data.duration}
                          setValue={mutation.setData}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: 0 }}
                        align="center"
                        padding="checkbox"
                      >
                        X
                      </TableCell>

                      <TableCell sx={{ borderBottom: 0 }} align="left">
                        <TextField
                          fullWidth
                          disabled
                          label="Biaya"
                          variant="standard"
                          value={utils.formatCurrency(data.overtimePrice || 0)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ borderBottom: 0 }}
                        align="center"
                        padding="checkbox"
                      >
                        =
                      </TableCell>

                      <TableCell
                        sx={{ borderBottom: 0 }}
                        align="center"
                        padding="checkbox"
                      >
                        <Typography variant="subtitle1">
                          {utils.formatCurrency(
                            (mutation.data.duration / 60) *
                              (data.overtimePrice || 0)
                          )}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Stack>
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
              Simpan Perubahan
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
