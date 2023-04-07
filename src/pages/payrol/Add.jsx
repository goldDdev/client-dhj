import React from "react";
import FRHooks from "frhooks";
import {
  Chip,
  Grid,
  List,
  ListItem as MuiListItem,
  ListItemText as MuiListItemText,
  Paper,
  styled,
  Typography,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  TextField,
  Stack,
  Box,
  MenuItem,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Checkbox,
} from "@mui/material";
import { IconButton, Button, Select } from "@components/base";
import { useSnackbar } from "notistack";
import { Link, useLocation } from "react-router-dom";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as Filter from "./filter";
import * as FORM from "./form";
import * as Dummy from "../../constants/dummy";
import DataTable from "../../components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import { useParams } from "react-router-dom";
import { TabContext, TabPanel } from "@mui/lab";
import { Check, Close, NoteAdd } from "@mui/icons-material";
import { ListForm, SimpleList } from "@components/base/list";
import moment from "moment";

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  padding: 0,
  margin: 0,
}));

export default () => {
  const { id } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = React.useState({
    month: +moment().format("M"),
    year: moment().year(),
  });
  const [trigger, setTrigger] = React.useState({
    form: false,
    editSalary: false,
    currentId: 0,
  });

  const employees = FRHooks.useFetch(apiRoute.employee.all, {
    defaultValue: [],
    selector: (resp) => resp.data,
  });

  const payrols = FRHooks.useFetch(apiRoute.payrol.employeeAll, {
    defaultValue: [],
    selector: (resp) => resp.data,
    disabledOnDidMount: true,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: {
      items: [],
    },
    isNewRecord: (data) => data.id === 0,
  });

  const onSelectEmployee = (value) => async (e, checked) => {};

  console.log(mutation.data.items);

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
                  selected: trigger.currentId === v.id,
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

          {payrols.data.map((value, i) => (
            <Paper key={i} sx={{ mb: 1 }} variant="outlined">
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell size="small">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <div>
                          <Checkbox
                            value={value.id}
                            onChange={() => {
                              mutation.setData({
                                items: mutation.data.items.some(
                                  (v) => v.id === value.id
                                )
                                  ? mutation.data.items.filter(
                                      (v) => v.id !== value.id
                                    )
                                  : mutation.data.items.concat([value.id]),
                              });
                            }}
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
                        secondary={utils.formatCurrency(value.totalEarn || 0)}
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
          ))}
        </Grid>
      </Grid>
    </SettingTemplate>
  );
};
