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
  IconButton,
} from "@mui/material";
import { Select } from "@components/base";
import { useSnackbar } from "notistack";
import { ListForm, SimpleList } from "@components/base/list";
import { LoadingButton } from "@mui/lab";
import { useAlert } from "@contexts/AlertContext";
import { Add, Clear, Money } from "@mui/icons-material";
import { OtherForm } from "./form";

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

  const [other, setOther] = React.useState({
    index: -1,
    name: "",
    role: "",
    otherCut: 0,
    otherAdditional: 0,
    noteOtherCut: "",
    noteOtherAdditional: "",
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
        : mutation.data.items.concat([
            {
              id: value.id,
              otherCut: 0,
              otherAdditional: 0,
              noteOtherCut: "",
              noteOtherAdditional: "",
            },
          ]),
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

  const onOther = (value) => () => {
    let otherCut = 0;
    let noteOtherCut = "";
    let otherAdditional = 0;
    let noteOtherAdditional = 0;

    const index = mutation.data.items.findIndex((v) => v.id === value.id);
    if (index > -1) {
      otherCut = mutation.data.items[index].otherCut;
      noteOtherCut = mutation.data.items[index].noteOtherCut;
      otherAdditional = mutation.data.items[index].otherAdditional;
      noteOtherAdditional = mutation.data.items[index].noteOtherAdditional;
    }

    setOther({
      index: value.id,
      name: value.name,
      role: utils.typesLabel(value.role),
      otherCut,
      otherAdditional,
      noteOtherCut,
      noteOtherAdditional,
    });
  };

  const onRemoveCut = (index) => () => {
    mutation.data.items[index].otherCut = 0;
    mutation.data.items[index].noteOtherCut = "";

    mutation.setData({
      ...mutation.data,
    });
  };

  const onRemoveAdditional = (index) => () => {
    mutation.data.items[index].otherAdditional = 0;
    mutation.data.items[index].noteOtherAdditional = "";

    mutation.setData({
      ...mutation.data,
    });
  };

  console.log(mutation.data);

  return (
    <SettingTemplate
      title={"Penggajian"}
      subtitle={"Halaman pembayaran gaji berdasarkan role karyawan"}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Typography m={1} fontWeight={500}>
              Daftar Role
            </Typography>
            <Divider />

            <SimpleList
              type="button"
              sx={{
                paddingTop: 0,
                overflow: "scroll",
                height: {
                  xs: "320px",
                  sm: "320px",
                  md: "320px",
                  lg: "100%",
                  xl: "100%",
                
                },
              }}
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

        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
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
                startIcon={<Money />}
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
            ? payrols.data.map((value, i) => {
                let otherCut = 0;
                let noteOtherCut = "";
                let otherAdditional = 0;
                let noteOtherAdditional = 0;

                const index = mutation.data.items.findIndex(
                  (v) => v.id === value.id
                );

                if (index > -1) {
                  otherCut = mutation.data.items[index].otherCut;
                  noteOtherCut = mutation.data.items[index].noteOtherCut;
                  otherAdditional = mutation.data.items[index].otherAdditional;
                  noteOtherAdditional =
                    mutation.data.items[index].noteOtherAdditional;
                }

                const total =
                  (value.salary || 0) +
                  (value.totalEarn || 0) +
                  otherAdditional -
                  ((value.totalLatePrice || 0) + otherCut);
                return (
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
                              ).format("DD-MM-Y")} s/d ${moment(
                                value.end
                              ).format("DD-MM-Y")}`}
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
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <div>
                                <IconButton
                                  disabled={
                                    !mutation.data.items.some(
                                      (_v) => _v.id === value.id
                                    )
                                  }
                                  size="small"
                                  onClick={onOther(value)}
                                >
                                  <Add fontSize="inherit" />
                                </IconButton>
                              </div>
                              <ListItemText
                                primary="Potongan Lainya"
                                primaryTypographyProps={{ variant: "body2" }}
                                secondary={noteOtherCut || "-"}
                                secondaryTypographyProps={{
                                  variant: "caption",
                                }}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              <div>
                                <Typography variant="subtitle1">
                                  {utils.formatCurrency(otherCut)}
                                </Typography>{" "}
                              </div>
                              {otherCut > 0 ? (
                                <div>
                                  <IconButton
                                    size="small"
                                    onClick={onRemoveCut(index)}
                                  >
                                    <Clear fontSize="inherit" />
                                  </IconButton>
                                </div>
                              ) : null}
                            </Stack>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <div>
                                <IconButton
                                  disabled={
                                    !mutation.data.items.some(
                                      (_v) => _v.id === value.id
                                    )
                                  }
                                  size="small"
                                  onClick={onOther(value)}
                                >
                                  <Add fontSize="inherit" />
                                </IconButton>
                              </div>
                              <ListItemText
                                primary="Tambahan Lainya"
                                primaryTypographyProps={{ variant: "body2" }}
                                secondary={noteOtherAdditional || "-"}
                                secondaryTypographyProps={{
                                  variant: "caption",
                                }}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                              alignItems="center"
                            >
                              <div>
                                <Typography variant="subtitle1">
                                  {utils.formatCurrency(otherAdditional)}
                                </Typography>{" "}
                              </div>
                              {otherAdditional > 0 ? (
                                <div>
                                  <IconButton
                                    size="small"
                                    onClick={onRemoveAdditional(index)}
                                  >
                                    <Clear fontSize="inherit" />
                                  </IconButton>
                                </div>
                              ) : null}
                            </Stack>
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
                              primary={utils.formatCurrency(total)}
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
                );
              })
            : null}
        </Grid>
      </Grid>

      <OtherForm
        open={other.index !== -1}
        onOpen={() => {
          setOther({
            index: -1,
            name: "",
            role: "",
            otherCut: 0,
            otherAdditional: 0,
            noteOtherCut: "",
            noteOtherAdditional: "",
          });
        }}
        mutation={mutation}
        other={other}
        setOther={setOther}
        onSubmit={() => {
          const index = mutation.data.items.findIndex(
            (v) => v.id === other.index
          );

          if (index > -1) {
            mutation.data.items[index].otherCut = other.otherCut;
            mutation.data.items[index].otherAdditional = other.otherAdditional;
            mutation.data.items[index].noteOtherCut = other.noteOtherCut;
            mutation.data.items[index].noteOtherAdditional =
              other.noteOtherAdditional;
            setOther({
              index: -1,
              name: "",
              role: "",
              otherCut: 0,
              otherAdditional: 0,
              noteOtherCut: "",
              noteOtherAdditional: "",
            });
          }
        }}
      />
    </SettingTemplate>
  );
};
