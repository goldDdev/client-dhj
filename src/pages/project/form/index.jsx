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
import { Link } from "react-router-dom";

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
