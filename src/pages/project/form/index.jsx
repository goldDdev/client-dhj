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
  Chip,
  List,
  ListItem,
  ListItemText,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Check,
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
}) => (
  <DialogForm
    open={open}
    onClose={onOpen}
    title="Form Agenda"
    maxWidth="md"
    content={{
      children: (
        <Stack spacing={1.5} direction="column">
          {type === "full" ? (
            <TextField
              disabled={mutation.loading || mutation.processing}
              label="Nama Agenda"
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

          <FieldSet disabledDivider>
            <TextField
              InputLabelProps={{ shrink: true }}
              disabled={mutation.loading || mutation.processing}
              label={type === "full" ? "Tanggal" : "Tanggal Aktual"}
              value={
                mutation.data[type === "full" ? "datePlan" : "actualDate"] || ""
              }
              onChange={(e) =>
                mutation.setData({
                  [type === "full" ? "datePlan" : "actualDate"]: e.target.value,
                })
              }
              onBlur={async () =>
                mutation.validate(type === "full" ? "datePlan" : "actualDate")
              }
              error={mutation.error(
                type === "full" ? "datePlan" : "actualDate"
              )}
              helperText={mutation.message(
                type === "full" ? "datePlan" : "actualDate"
              )}
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
              InputLabelProps={{ shrink: true }}
              disabled={mutation.loading || mutation.processing}
              label={type === "full" ? "Waktu" : "Waktu Aktual"}
              value={
                mutation.data[type === "full" ? "timePlan" : "actualTime"] || ""
              }
              onChange={(e) =>
                mutation.setData({
                  [type === "full" ? "timePlan" : "actualTime"]: e.target.value,
                })
              }
              onBlur={async () =>
                mutation.validate(type === "full" ? "timePlan" : "actualTime")
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

          <FieldSet
            label="Status Agenda"
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
                variant={mutation.data.status === k ? "contained" : "outlined"}
                onClick={() => {
                  mutation.setData({ status: k });
                }}
              />
            ))}
          </FieldSet>

          {type === "full" ? (
            <FieldSet
              label="Deskripsi"
              stackProps={{ direction: "column", spacing: 2 }}
            >
              <TextField
                multiline
                rows={2}
                disabled={mutation.loading || mutation.processing}
                fullWidth
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
                  snackbar(`Agenda Berhasil Ditambahkan`);
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
                          mutation.post(route().project("boq").link(), {
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
                  secondary="Coba Ketikkan nama lain mana tau ada"
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
