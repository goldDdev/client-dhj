import React from "react";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import FRHooks from "frhooks";
import * as FORM from "./form";
import * as utils from "@utils/";
import * as Dummy from "../../constants/dummy";
import _ from "lodash";
import moment from "moment";
import apiRoute from "@services/apiRoute";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { SimpleList } from "@components/base/list";
import {
  Edit,
  Close,
  MoreVert,
  PersonAddAlt,
  Refresh,
} from "@mui/icons-material";
import { BasicDropdown, IconButton } from "@components/base";
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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const validation = FRHooks.useServerValidation({
    url: apiRoute.project.validation,
    param: {
      path: "field",
      type: "rule",
    },
    withErrorResponse: (resp) => resp.response.data.error.messages.errors,
    option: {
      unique: (param) => "Nomor SPK ini sudah ada",
    },
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.project,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required(),
        companyName: y.string().required(),
        noSpk: y.string().required(),
        contact: y.string().nullable(),
        location: y.string().nullable(),
        latitude: y.number().nullable(),
        longitude: y.number().nullable(),
        startAt: y.date().nullable(),
        finishAt: y.date().nullable(),
        targetDate: y.date().nullable(),
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
      if (data.length > 0) {
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

  const onSubmit = () => {
    mutation.put(apiRoute.project.index, {
      serverValidation: {
        serve: validation.serve,
        method: "post",
      },
      validation: true,
      onSuccess: (resp) => {
        onOpen();
        enqueueSnackbar(`Proyek berhasil diperbaharui`, {
          variant: "success",
        });
      },
    });
  };

  const onRefresh = () => {
    mutation.get([apiRoute.project.detail, { id }], {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
  };

  React.useEffect(() => {
    mutation.get([apiRoute.project.detail, { id }], {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
  }, [id]);

  const dateProject = `${moment(
    mutation.data.startAt
  ).format("DD-MM-yyyy")} s/d ${moment(mutation.data.finishAt).format(
    "DD-MM-yyyy"
  )} ${
    mutation.data.targetDate
      ? `-> ${moment(mutation.data.targetDate).format("DD-MM-yyyy")}`
      : ""
  }`;
  return (
    <ProjectTemplate
      container={"container"}
      title="Proyek"
      subtitle={"Detail Proyek"}
      headRight={{
        children: (
          <LoadingButton
            loading={mutation.loading}
            disabled={mutation.loading}
            onClick={onRefresh}
            color="primary"
            variant="outlined"
            startIcon={<Refresh />}
          >
            Muat Ulang
          </LoadingButton>
        ),
      }}
    >
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <Paper elevation={0} variant="outlined">
            <List dense>
              <ListItem
                divider
                secondaryAction={
                  <IconButton title="Ubah" onClick={onOpen}>
                    <Edit />
                  </IconButton>
                }
              >
                <ListItemText
                  primary="Nomor SPK"
                  secondary={mutation.data.noSpk}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>

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
                  primary="Nilai Proyek"
                  secondary={utils.formatCurrency(mutation.data.price)}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={`Durasi Proyek : ${mutation.data.duration} Hari`}
                  secondary={dateProject}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{ variant: "body1" }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <Paper elevation={0} variant="outlined">
            <List dense>
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
                  primary="Perusahaan/Team"
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
                  primary={`Lokasi Proyek : ${mutation.data.location || "-"}`}
                  primaryTypographyProps={{
                    variant: "subtitle1",
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem dense>
                <ListItemText
                  primary="Koordinat"
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

        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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

        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
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
                disabled={resources.parentId === null}
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
        onOpen={onOpen}
        onSubmit={onSubmit}
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
