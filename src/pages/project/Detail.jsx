import React from "react";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import FRHooks from "frhooks";
import * as utils from "@utils/";
import * as Dummy from "@constants/dummy";
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
import ProjectCreate from "./form/ProjectCreate";
import WorkerCreate from "./form/WorkerCreate";

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
        id: y.number().optional(),
        name: y.string().required().label("Nama"),
        noSpk: y.string().required().label("No SPK"),
        companyName: y.string().required().label("Team"),
        contact: y.string().optional(),
        startAt: y.date().optional(),
        finishAt: y.date().optional(),
        duration: y.number().optional(),
        price: y.number().optional(),
        location: y.string().optional(),
        latitude: y.number().optional(),
        longitude: y.number().optional(),
        targetDate: y.date().optional(),
        status: y.string().required(),
        note: y.string().optional(),
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
    curr: "",
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
    setTrigger((state) => ({
      ...state,
      form: !state.form,
    }));
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
    mutation.get(["project.detail", { id }], {
      onSuccess: (resp) => {
        const data = {
          id: resp.data.id,
          name: resp.data.name,
          noSpk: resp.data.noSpk,
          companyName: resp.data.companyName,
          contact: resp.data.contact || "",
          startAt: resp.data.startAt,
          finishAt: resp.data.finishAt,
          duration: resp.data.duration,
          price: resp.data.price,
          location: resp.data.location || "",
          latitude: resp.data.latitude,
          longitude: resp.data.longitude,
          targetDate: resp.data.targetDate,
          status: resp.data.status,
          note: resp.data.note || "",
        };
        setTrigger((state) => ({
          ...state,
          curr: btoa(JSON.stringify(data)),
        }));
        mutation.setData(data);
      },
    });
  };

  React.useEffect(() => {
    mutation.get(["project.detail", { id }], {
      onSuccess: (resp) => {
        const data = {
          id: resp.data.id,
          name: resp.data.name,
          noSpk: resp.data.noSpk,
          companyName: resp.data.companyName,
          contact: resp.data.contact || "",
          startAt: resp.data.startAt,
          finishAt: resp.data.finishAt,
          duration: resp.data.duration,
          price: resp.data.price,
          location: resp.data.location || "",
          latitude: resp.data.latitude,
          longitude: resp.data.longitude,
          targetDate: resp.data.targetDate,
          status: resp.data.status,
          note: resp.data.note || "",
        };
        setTrigger((state) => ({
          ...state,
          curr: btoa(JSON.stringify(data)),
        }));
        mutation.setData(data);
      },
    });
  }, [id]);

  const isCurr = React.useMemo(
    () => trigger.curr !== btoa(JSON.stringify(mutation.data)),
    [trigger.curr, mutation.data]
  );

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
                  secondary={
                    <span
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span>
                        Tanggal Mulai :{" "}
                        {moment(mutation.data.startAt).format("DD-MM-yyyy")}
                      </span>

                      <span>
                        Tanggal Final :{" "}
                        {moment(mutation.data.finishAt).format("DD-MM-yyyy")}
                      </span>

                      <span>
                        Target Selesai :{" "}
                        {moment(mutation.data.targetDate).format("DD-MM-yyyy")}
                      </span>
                    </span>
                  }
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
                  primary="Team"
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
                PIC
              </Typography>

              <Button
                variant="text"
                startIcon={<PersonAddAlt />}
                disableElevation
                onClick={onOpenAddWorker("lead")}
              >
                Tambah PIC (SPV, Mandor, QS, QC)
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
                Daftar Anggota PIC (Mandor)
              </Typography>

              <Button
                disabled={resources.parentId === null}
                variant="text"
                startIcon={trigger.openWorker ? <Close /> : <PersonAddAlt />}
                disableElevation
                onClick={onOpenAddWorker("worker")}
              >
                Tambah Anggota PIC
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

      <ProjectCreate
        isCurr={isCurr}
        open={trigger.form}
        mutation={mutation}
        onOpen={onOpen}
        onSubmit={onSubmit}
      />

      <WorkerCreate
        trigger={trigger}
        searchWorkers={searchWorkers}
        onOpen={onOpenAddWorker}
        onAddMember={onAddMember}
      />
    </ProjectTemplate>
  );
};
