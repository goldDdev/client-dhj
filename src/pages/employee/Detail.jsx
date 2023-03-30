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
import { TabPanel } from "@mui/lab";

const ListItem = styled(MuiListItem)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
}));

export default () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState("proyek");
  const [trigger, setTrigger] = React.useState({
    form: false,
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

  const projects = FRHooks.useTable(apiRoute.project)

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    mutation.get([apiRoute.employee.detail, { id }], {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
  }, [id]);

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

            <TabPanel value={value}></TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </SettingTemplate>
  );
};
