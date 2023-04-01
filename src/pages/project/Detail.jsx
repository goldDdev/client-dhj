import React from "react";
import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  List,
  Stack,
  CircularProgress,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import { Edit, Close, MoreVert, PersonAddAlt } from "@mui/icons-material";
import { BasicDropdown } from "@components/base";
import FRHooks from "frhooks";
import * as FORM from "./form";
import * as utils from "@utils/";
import * as Dummy from "../../constants/dummy";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { SimpleList } from "@components/base/list";
import _ from "lodash";
import moment from "moment";
import apiRoute from "@services/apiRoute";

export default () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.project,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        companyName: y.string().required(),
        noSpk: y.string().nullable(),
        contact: y.string().nullable(),
        location: y.string().nullable(),
        latitude: y.number().nullable(),
        longitude: y.number().nullable(),
        startAt: y.date().nullable(),
        finishAt: y.date().nullable(),
        status: y.string().required(),
        duration: y.number().nullable(),
      }),
  });
  const [resources, setResources] = React.useState({
    members: [],
    parentId: null,
  });
  const [trigger, setTrigger] = React.useState({
    form: false,
    openWorker: false,
    addWorkerLoading: [],
  });

  const workers = FRHooks.useFetch([apiRoute.project.listWorkers, { id }], {
    selector: (resp) => resp.data,
    defaultValue: [],
    getData: (data) => {
      if(data.length > 0){
        setResources((state) => ({
          ...state,
          members: data[0].members,
          parentId: data[0].id,
        }));
      }
    },
  });

  const searchWorkers = FRHooks.useFetch(apiRoute.employee.index, {
    selector: (resp) => resp.data,
    defaultValue: [],
    disabledOnDidMount: true,
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearError();
  };

  const onAddMember = (value) => async () => {
    try {
      setTrigger((state) => {
        state.addWorkerLoading.push(value.id);
        return state;
      });

      const data = await FRHooks.apiRoute()
        .project("worker")
        .data({
          projectId: +id,
          employeeId: value.id,
          role: value.role,
          parentId: value.role !== "WORKER" ? null : resources.parentId,
        })
        .sendJson("post", (resp) => resp.data);

      searchWorkers.destroy((v) => v.id === value.id);
      if (value.role === "WORKER") {
        setResources((state) => {
          state.members.push(data);
          return state;
        });
      } else {
        workers.add({ ...data, members: [] });
      }
    } catch (err) {
    } finally {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.filter((v) => v !== value.id),
      }));
    }
  };

  const onRemoveMembers = (value) => async () => {
    try {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.concat([value.id]),
      }));

      await FRHooks.apiRoute()
        .project("deleteWorker", { id: value.id })
        .destroy((resp) => resp.data);

      if (value.role === "WORKER") {
        setResources((state) => {
          state.members.splice(
            state.members.findIndex((v) => v.id === value.id),
            1
          );
          return state;
        });
      } else {
        workers.refresh();
      }
    } finally {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.filter((v) => v !== value.id),
      }));
    }
  };

  const onOpenAddWorker = (type) => (e) => {
    setTrigger((state) => ({
      ...state,
      openWorker: !state.openWorker,
    }));

    if (!trigger.openWorker) {
      searchWorkers.setQuery({ type, except: id });
    }
  };

  React.useEffect(() => {
    mutation.get([apiRoute.project.detail, { id }], {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
  }, [id]);

  return (
    <ProjectTemplate
      container={"container"}
      title="Proyek"
      headRight={{
        children: (
          <Button disableElevation startIcon={<Edit />} onClick={onOpen}>
            Ubah
          </Button>
        ),
      }}
    >
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={9}>
          <Paper elevation={0} variant="outlined">
            <List dense>
              <ListItem divider>
                <ListItemText
                  primary="Nama Proyek"
                  secondary={mutation.data.name}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>

              <ListItem divider>
                <ListItemText
                  primary="Lama Pengerjaan"
                  secondary={`${mutation.data.duration} Hari | ${moment(
                    mutation.data.startAt
                  ).format("DD-MM-yyyy")} - ${moment(
                    mutation.data.finishAt
                  ).format("DD-MM-yyyy")}`}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>

              {/* Perusahaan */}
              <ListItem divider>
                <ListItemText
                  primary="Informasi Pemberi Proyek"
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem dense>
                <ListItemText
                  primary="Perusahaan"
                  secondary={mutation.data.companyName}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>

              <ListItem dense divider>
                <ListItemText
                  primary="Kontak"
                  secondary={mutation.data.contact || "-"}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    variant: "body1",
                    whiteSpace: "pre-line",
                  }}
                />
              </ListItem>

              {/* Lokasi */}
              <ListItem divider>
                <ListItemText
                  primary="Lokasi Proyek"
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem dense>
                <ListItemText
                  primary={mutation.data.location || "-"}
                  secondary={`Lat: ${mutation.data.latitude || "-"} | Long: ${
                    mutation.data.longitude || "-"
                  }`}
                  primaryTypographyProps={{
                    variant: "body1",
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={4}>
          <Paper variant="outlined">
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
                startIcon={<PersonAddAlt />}
                disableElevation
                onClick={onOpenAddWorker("lead")}
              >
                Tambah Pekerja
              </Button>
            </Stack>
            <Divider />
            <SimpleList
              type="button"
              loading={mutation.loading}
              data={workers.data.map((v, i) => ({
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
                  onClick: () => {
                    setResources((state) => ({
                      ...state,
                      members: v.members,
                      parentId: v.id,
                    }));
                  },
                },
                itemProps: {
                  selected: resources.parentId === v.id,
                  divider: workers.data.length - 1 !== i,
                  sx: { pl: 0 },
                  secondaryAction: trigger.addWorkerLoading.some(
                    (_v) => _v === v.id
                  ) ? (
                    <CircularProgress size={20} />
                  ) : (
                    <BasicDropdown
                      type="icon"
                      menu={[
                        {
                          text: "Hapus",
                          onClick: onRemoveMembers(v),
                          disabled: v.members.length > 0,
                        },
                      ]}
                      label={<MoreVert fontSize="small" />}
                      size="small"
                    />
                  ),
                },
              }))}
            />
          </Paper>
        </Grid>

        <Grid item xs={8}>
          <Paper variant="outlined">
            <Stack
              p={1.5}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Daftar Anggota
              </Typography>

              <Button
                variant="text"
                startIcon={trigger.openWorker ? <Close /> : <PersonAddAlt />}
                disableElevation
                onClick={onOpenAddWorker("worker")}
              >
                Tambah Anggota
              </Button>
            </Stack>
            <Divider />
            <SimpleList
              dense
              data={resources.members.map((v, i) => ({
                primary: v.name,
                primaryTypographyProps: { variant: "subtitle2" },
                secondary: utils.typesLabel(v.role),
                secondaryTypographyProps: { variant: "body2" },
                itemProps: {
                  dense: true,
                  divider: resources.members.length - 1 !== i,
                  secondaryAction: trigger.addWorkerLoading.some(
                    (_v) => _v === v.id
                  ) ? (
                    <CircularProgress size={20} />
                  ) : (
                    <BasicDropdown
                      type="icon"
                      menu={[
                        {
                          text: "Hapus",
                          onClick: onRemoveMembers(v),
                        },
                      ]}
                      label={<MoreVert fontSize="small" />}
                      size="small"
                    />
                  ),
                },
              }))}
            />
          </Paper>
        </Grid>
      </Grid>

      <FORM.Create
        open={trigger.form}
        mutation={mutation}
        route={FRHooks.apiRoute}
        snackbar={enqueueSnackbar}
        onOpen={onOpen}
      />

      <FORM.WorkerCreate
        trigger={trigger}
        searchWorkers={searchWorkers}
        onOpen={onOpenAddWorker}
        onAddMember={onAddMember}
      />
    </ProjectTemplate>
  );
};
