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
} from "@mui/material";
import { IconButton, Button } from "@components/base";
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

const ListItem = styled(MuiListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

export default () => {
  const { id } = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState("project");
  const [trigger, setTrigger] = React.useState({
    form: false,
  });
  const projects = FRHooks.useTable([apiRoute.employee.project, { id }], {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });
  const absents = FRHooks.useTable([apiRoute.employee.absent, { id }], {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
    disabledOnDidMount: true,
  });

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

  React.useEffect(() => {
    mutation.get([apiRoute.employee.detail, { id }], {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
  }, [id]);

  React.useEffect(() => {
    if (!location.hash) return;
    if (location.hash === "#absents") absents.reload();
    setValue(location.hash.replace("#", ""));
  }, [location]);

  console.log(location);

  return (
    <SettingTemplate title={"Karyawan"} subtitle={"Detail Karyawam"}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Typography m={1} fontWeight={500}>
              Info Karyawan
            </Typography>
            <Divider />
            <List dense>
              <ListItem>
                <ListItemText primary={"Nama"} secondary={mutation.data.name} />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"Role"}
                  secondary={utils.typesLabel(mutation.data.role)}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"Karyawan ID"}
                  secondary={mutation.data.cardID}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"No HP"}
                  secondary={mutation.data.phoneNumber}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"Email"}
                  secondary={mutation.data.email || "-"}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper variant="outlined" sx={{ mb: 2 }}>
            <Typography m={1} fontWeight={500}>
              Info Gaji
            </Typography>
            <Divider />
            <List dense>
              <ListItem>
                <ListItemText
                  primary={"Gaji Pokok"}
                  secondary={utils.formatCurrency(mutation.data.salary)}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={"Upah Perjam"}
                  secondary={utils.formatCurrency(mutation.data.hourlyWages)}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <TabContext value={value}>
            <Paper variant="outlined" sx={{ mb: 2 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="wrapped label tabs example"
              >
                <Tab value="project" label="Proyek" />
                <Tab value="absents" label="Absensi" />
                <Tab value="payroll" label="Penggajian" />
              </Tabs>
            </Paper>

            <TabPanel value="project" sx={{ p: 0 }}>
              <Paper elevation={0} variant="outlined">
                <DataTable
                  data={projects.data}
                  loading={projects.loading}
                  column={[
                    {
                      label: "No",
                      value: (_, idx) => {
                        return projects.pagination.from + idx;
                      },
                      head: {
                        align: "center",
                        padding: "checkbox",
                      },
                      align: "center",
                      padding: "checkbox",
                      size: "small",
                    },
                    {
                      label: "Nama",
                      value: (value) => (
                        <Link
                          to={`/project/${value.id}/detail`}
                          style={{ textDecoration: "none", fontWeight: 500 }}
                        >
                          {value.name}
                        </Link>
                      ),
                      sx: { whiteSpace: "nowrap" },
                    },
                    {
                      label: "Perusahaan",
                      value: (value) => value.companyName,
                      head: {
                        noWrap: true,
                        sx: {
                          width: "15%",
                        },
                      },
                      sx: { whiteSpace: "nowrap" },
                    },
                    {
                      label: "Status",
                      value: (value) => value.status,
                      head: {
                        sx: {
                          width: "10%",
                        },
                      },
                    },
                  ]}
                  pagination={utils.pagination(projects.pagination)}
                />
              </Paper>
            </TabPanel>

            <TabPanel value="absents" sx={{ p: 0 }}>
              <Paper elevation={0} variant="outlined">
                <DataTable
                  data={absents.data}
                  loading={absents.loading}
                  column={[
                    {
                      label: "No",
                      value: (_, idx) => {
                        return absents.pagination.from + idx;
                      },
                      head: {
                        align: "center",
                        padding: "checkbox",
                      },
                      align: "center",
                      padding: "checkbox",
                      size: "small",
                    },
                    {
                      label: "Nama",
                      value: (value) => (
                        <Link
                          to={`/project/${value.id}/detail`}
                          style={{ textDecoration: "none", fontWeight: 500 }}
                        >
                          <ListItemText
                            primary={value.projectName || "-"}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                            }}
                            secondary={`${value.projectStatus || "-"}`}
                            secondaryTypographyProps={{ variant: "body2" }}
                            sx={{ py: 0 }}
                          />
                        </Link>
                      ),
                      sx: { whiteSpace: "nowrap" },
                      size: "small",
                    },
                    {
                      label: "Ket",
                      value: (value) => value.absent,
                      head: {
                        noWrap: true,
                        align: "center",
                      },
                      align: "center",
                      sx: { whiteSpace: "nowrap" },
                      padding: "checkbox",
                    },
                    {
                      label: "Tanggal",
                      value: (value) => value.absentAt,
                      head: {
                        noWrap: true,
                      },
                      sx: { whiteSpace: "nowrap" },
                    },
                    {
                      label: "Datang",
                      value: (value) => value.comeAt,
                      head: {
                        noWrap: true,
                      },
                      sx: { whiteSpace: "nowrap" },
                    },
                    {
                      label: "Pulang",
                      value: (value) => value.closeAt || "-",
                      head: {
                        noWrap: true,
                      },
                      sx: { whiteSpace: "nowrap" },
                    },
                  ]}
                  pagination={utils.pagination(absents.pagination)}
                />
              </Paper>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </SettingTemplate>
  );
};
