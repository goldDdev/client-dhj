import React from "react";
import FRHooks from "frhooks";
import {
  Chip,
  Grid,
  List,
  ListItem as MuiListItem,
  ListItemText,
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

const ListItem = styled(MuiListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

export default () => {
  const { id } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState("project");
  const [form, setForm] = React.useState({
    month: +moment().format("M"),
    year: moment().year(),
  });
  const [employee, setEmployee] = React.useState(Dummy.employee);
  const [trigger, setTrigger] = React.useState({
    form: false,
    editSalary: false,
    currentId: 0,
  });

  const employees = FRHooks.useFetch(apiRoute.employee.all, {
    defaultValue: [],
    selector: (resp) => resp.data,
  });

  // const absents = FRHooks.useTable([apiRoute.employee.absent, { id }], {
  //   selector: (resp) => resp.data,
  //   total: (resp) => resp.meta.total,
  //   disabledOnDidMount: true,
  // });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.employee,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        cardID: y.string().required(),
        phoneNumber: y.string().required().min(10).max(12),
        email: y.string().when("role", {
          is: (role) => {
            return role !== "WORKER";
          },
          then: y.string().required(),
        }),
        role: y.string().required(),
      }),
    format: {
      phoneNumber: (value) => String(value),
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    window.location.hash = `#${newValue}`;
  };

  const onSelectEmployee = (value) => async () => {
    mutation.get([apiRoute.payrol.employee, { id: value.id }], {
      onSuccess: ({ data }) => {
        setEmployee(data);
        setTrigger((state) => ({ ...state, currentId: value.id }));
      },
    });
  };

  console.log(employee);

  return (
    <SettingTemplate
      title={"Penggajian"}
      subtitle={"Halaman pembayan gaji perorang"}
    >
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <TextField
            // value={table.query("role", "")}
            // onChange={(e) => table.setQuery({ role: e.target.value })}
            select
            label="Filter Role"
          >
            <MenuItem value="" selected>
              Filter Role
            </MenuItem>
            {utils.types.map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </TextField>

          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Typography m={1} fontWeight={500}>
              Daftar Karyawan
            </Typography>
            <Divider />

            <SimpleList
              type="button"
              sx={{ paddingTop: 0 }}
              loading={employees.loading}
              data={employees.data.map((v, i) => ({
                primary: v.name,
                primaryTypographyProps: { variant: "subtitle2" },
                secondary: utils.typesLabel(v.role),
                secondaryTypographyProps: { variant: "body2" },
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
                  divider: employees.data.length - 1 !== i,
                  selected: trigger.currentId === v.id,
                  sx: { pl: 0 },
                },
              }))}
            />
          </Paper>
        </Grid>

        <Grid item xs={9}>
          {/* <Paper variant="outlined">
            <FORM.Employee employee={employee} />
          </Paper> */}

          <ListForm
            title="Pembayaran Gaji Periode"
            subtitle={"Bulan/Tahun"}
            mt={0}
          >
            <Stack direction="row" spacing={1} width="50%">
              <Select
                name="month"
                value={form.month}
                menu={utils.monthID.map((v, i) => ({ text: v, value: i + 1 }))}
                onChange={(e) =>
                  setForm((state) => ({ ...state, month: +e.target.value }))
                }
              />
              <TextField
                name="year"
                value={form.year}
                onChange={(e) =>
                  setForm((state) => ({ ...state, year: +e.target.value }))
                }
              />
            </Stack>
          </ListForm>

          <ListForm
            title="Gaji Pokok"
            subtitle={"Gaji Pokok yang diterima saat ini"}
          >
            <Typography variant="h6">
              {utils.formatCurrency(employee.salary)}
            </Typography>
          </ListForm>

          <ListForm
            title="Absensi"
            subtitle={`Jumlah Kehadiran Periode ${moment(
              employee.absent?.start
            ).format("DD-MM-Y")} s/d ${moment(employee.absent?.end).format(
              "DD-MM-Y"
            )}`}
          >
            <Typography variant="h6">
              {employee.absent?.totalPresent || 0}
            </Typography>
          </ListForm>

          <ListForm
            title="Keterlambatan"
            subtitle={`Denda keterlambatan Rp 250,00/Menit`}
          >
            <ListItemText
              primary={utils.toHoursAndMinutes(
                employee.absent?.totalLateDuration || 0
              )}
              primaryTypographyProps={{
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
              secondary={utils.formatCurrency(
                employee.absent?.totalLatePrice || 0
              )}
              secondaryTypographyProps={{
                variant: "body1",
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
            />
          </ListForm>

          <ListForm
            title="Lembur"
            subtitle={`Denda keterlambatan Rp 250,00/Menit`}
          >
            <ListItemText
              primary={utils.toHoursAndMinutes(
                employee.absent?.totalLateDuration || 0
              )}
              primaryTypographyProps={{
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
              secondary={utils.formatCurrency(
                employee.absent?.totalLatePrice || 0
              )}
              secondaryTypographyProps={{
                variant: "body1",
                whiteSpace: "nowrap",
                textAlign: "right",
              }}
            />
          </ListForm>

          <ListForm title="Potongan Tambahan" subtitle={`-`}>
            <Stack direction="row" spacing={1} alignItems="center">
              <div>
                <Button title="Catatan">Catatan</Button>
              </div>
              <TextField />
            </Stack>
          </ListForm>

          <ListForm title="Biaya Tambahan" subtitle={`-`}>
            <Stack direction="row" spacing={1} alignItems="center">
              <div>
                <Button title="Catatan">Catatan</Button>
              </div>
              <TextField />
            </Stack>
          </ListForm>
        </Grid>
      </Grid>
    </SettingTemplate>
  );
};
