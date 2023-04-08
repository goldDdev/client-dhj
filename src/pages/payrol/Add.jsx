import React from "react";
import FRHooks from "frhooks";
import SettingTemplate from "@components/templates/SettingTemplate";
import * as utils from "@utils/";
import apiRoute from "@services/apiRoute";
import moment from "moment";
import {
  Grid,
  ListItemText as MuiListItemText,
  Paper,
  styled,
  Typography,
  Divider,
  TextField,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
  FormControlLabel,
  Skeleton,
 IconButton 
} from "@mui/material";
import { Select } from "@components/base";
import { useSnackbar } from "notistack";
import { ListForm, SimpleList } from "@components/base/list";
import { LoadingButton } from "@mui/lab";
import { useAlert } from "@contexts/AlertContext";

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  padding: 0,
  margin: 0,
}));

export default () => {
  const alert = useAlert();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = React.useState({
    month: +moment().format("M"),
    year: moment().year(),
  });

  const payrols = FRHooks.useFetch(apiRoute.payrol.employeeAll, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: {
      items: [],
      month: 0,
      year: 0,
    },
  });

  const onSelectEmployee = (value) => async (e, checked) => {
    mutation.setData({
      items: mutation.data.items.some((v) => v.id === value.id)
        ? mutation.data.items.filter((v) => v.id !== value.id)
        : mutation.data.items.concat([{ id: value.id }]),
    });
  };

  const onSelectAll = (e, checked) => {
    mutation.setData({
      items: payrols.data.filter((v) => !mutation.data.items.includes(v.ic)),
    });
  };

  const onSubmit = () => {
    alert.set({
      open: true,
      title: "Mohon Perhatian",
      message: "Anda akan membayar gaji untuk karyawan ini, apakah anda yakin?",
      type: "warning",
      loading: false,
      close: {
        text: "Keluar",
      },
      confirm: {
        text: "Ya, Saya Mengerti",
        onClick: () => {
          mutation.post(apiRoute.payrol.addMulti, {
            validation: false,
            onBeforeSend: () => {
              mutation.merge(form);
              alert.set({ loading: false });
            },
            onSuccess: ({ data }) => {
              enqueueSnackbar("Penggajian berhasil ditambahkan");
              mutation.data.items.forEach((v) =>
                payrols.destroy((_v) => _v.id === v.id)
              );
              mutation.clearData();
              alert.reset();
            },
            onAlways: () => {
              alert.set({ loading: false });
            },
          });
        },
      },
    });
  };

  return (
    <SettingTemplate
      title={"Penggajian"}
      subtitle={"Halaman pembayan gaji perorang"}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Typography m={1} fontWeight={500}>
              Daftar Role
            </Typography>
            <Divider />

            <SimpleList
              type="button"
              sx={{ paddingTop: 0 }}
              data={utils.types.map((v, i) => ({
                primary: utils.typesLabel(v),
                primaryTypographyProps: { variant: "subtitle2" },
                iconProps: {
                  children: (
                    <Checkbox
                      value={v}
                      checked={payrols
                        .getQuery("role", [])
                        .some((_r) => _r === v)}
                      onChange={(e, checked) => {
                        payrols.setQuery((q) => {
                          const _role = q.role || [];
                          const isExist = (q.role || []).some(
                            (r) => r === e.target.value
                          );
                          if (isExist) {
                            q.role = _role.filter(
                              (_r) => _r !== e.target.value
                            );
                          } else {
                            _role.push(e.target.value);
                            q.role = _role;
                          }
                          return q;
                        });
                        payrols.setQuery({ ...form });
                      }}
                    />
                  ),
                  sx: { minWidth: 0 },
                },
                buttonProps: {
                  sx: {
                    py: 0,
                    "&.MuiListItemButton-root:hover": {
                      backgroundColor: "unset",
                    },
                  },
                  onClick: onSelectEmployee(v),
                },
                itemProps: {
                  divider: utils.types.length - 1 !== i,
                  sx: { pl: 0 },
                },
              }))}
            />
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <ListForm
            title="Pembayaran Gaji Periode"
            subtitle={"Bulan/Tahun"}
            mt={0}
            mb={2}
          >
            <Stack direction="row" spacing={1} width="50%">
              <Select
                name="month"
                value={form.month}
                menu={utils.monthID.map((v, i) => ({ text: v, value: i + 1 }))}
                onChange={(e) => {
                  setForm((state) => ({ ...state, month: +e.target.value }));
                  payrols.setQuery({ month: +e.target.value });
                }}
              />
              <TextField
                name="year"
                value={form.year}
                onChange={(e) => {
                  setForm((state) => ({ ...state, year: +e.target.value }));
                  payrols.setQuery({ year: +e.target.value });
                }}
              />
            </Stack>
          </ListForm>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            ml={1}
            spacing={2}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    disabled={payrols.data.length === 0}
                    onChange={onSelectAll}
                    checked={
                      mutation.data.items.length > 0 &&
                      mutation.data.items.length === payrols.data.length
                    }
                  />
                }
                label="Pilih Semua"
              />

              <div>
                <Typography>Dipilih ({mutation.data.items.length})</Typography>
              </div>
            </Stack>

            <div>
              <LoadingButton
                loading={mutation.processing}
                variant="contained"
                color="primary"
                disabled={mutation.data.items.length === 0}
                onClick={onSubmit}
              >
                Bayar
              </LoadingButton>
            </div>
          </Stack>

          {payrols.loading ? (
            <>
              <Skeleton width={"100%"} />
              <Skeleton width={"80%"} />
              <Skeleton width={"60%"} />
              <Skeleton width={"40%"} />
            </>
          ) : null}

          {!payrols.loading && payrols.data.length > 0
            ? payrols.data.map((value, i) => (
                <Paper key={i} sx={{ mb: 1 }} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell size="small">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <div>
                              <Checkbox
                                size="small"
                                value={value.id}
                                checked={mutation.data.items.some(
                                  (v) => v.id === value.id
                                )}
                                onChange={onSelectEmployee(value)}
                              />
                            </div>
                            <ListItemText
                              primary={value.name}
                              primaryTypographyProps={{
                                variant: "subtitle1",
                                fontWeight: 500,
                              }}
                              secondary={utils.typesLabel(value.role)}
                              secondaryTypographyProps={{ variant: "body2" }}
                            />
                          </Stack>
                        </TableCell>
                        <TableCell align="right" size="small"></TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell size="small">
                          <ListItemText
                            primary="Gaji Pokok"
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary="Gaji Pokok yang diterima saat ini"
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </TableCell>
                        <TableCell align="right" size="small">
                          <Typography variant="subtitle1">
                            {utils.formatCurrency(value.salary || 0)}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <ListItemText
                            primary="Absensi"
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary={`Jumlah Kehadiran Periode ${moment(
                              value.start
                            ).format("DD-MM-Y")} s/d ${moment(value.end).format(
                              "DD-MM-Y"
                            )}`}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1">
                            {value.totalPresent || 0}
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <ListItemText
                            primary="Keterlambatan"
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary={`Denda keterlambatan Rp 250,00/Menit`}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <ListItemText
                            primary={utils.toHoursAndMinutes(
                              value.totalLateDuration
                            )}
                            primaryTypographyProps={{
                              variant: "body2",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                            }}
                            secondary={`(-) ${utils.formatCurrency(
                              value.totalLatePrice
                            )}`}
                            secondaryTypographyProps={{
                              variant: "body2",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <ListItemText
                            primary="Lembur"
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary={`Denda keterlambatan Rp 250,00/Menit`}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <ListItemText
                            primary={utils.toHoursAndMinutes(
                              value.totalOvertimeDuration || 0
                            )}
                            primaryTypographyProps={{
                              variant: "body2",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                            }}
                            secondary={utils.formatCurrency(
                              value.totalEarn || 0
                            )}
                            secondaryTypographyProps={{
                              variant: "body2",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                            }}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>
                          <ListItemText
                            primary="Total"
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary={`Penghasilan Gaji Pokok + Lembur - Keterlambatan`}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <ListItemText
                            primary={utils.formatCurrency(
                              (value.salary || 0) +
                                (value.totalEarn || 0) -
                                (value.totalLatePrice || 0)
                            )}
                            primaryTypographyProps={{
                              variant: "subtitle1",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              ))
            : null}
        </Grid>
      </Grid>
    </SettingTemplate>
  );
};
