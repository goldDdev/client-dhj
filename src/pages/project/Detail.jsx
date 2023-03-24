import React from "react";
import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  List,
} from "@mui/material";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import Edit from "@mui/icons-material/Edit";
import FRHooks from "frhooks";
import * as FORM from "./form";
import * as Dummy from "../../constants/dummy";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAlert } from "@contexts/AlertContext";
import _ from "lodash";
let controller = new AbortController();

export default () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const alert = useAlert();
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
    worker: [],
    selectedWorker: [],
    lastMandorId: 0,
  });
  const [trigger, setTrigger] = React.useState({
    form: false,
    openWorker: false,
    workerSearchLoading: false,
    addWorkerLoading: [],
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearError();
  };

  const searchWorker = (e) => {
    controller.abort();
    controller = new AbortController();
    mutation.get(FRHooks.apiRoute().employee("index").link(), {
      options: {
        signal: controller.signal,
        params: {
          name: e.target.value,
        },
      },
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, workerSearchLoading: true }));
      },
      onSuccess: ({ data }) => {
        setResources((state) => ({
          ...state,
          worker: data.filter(
            (v) => !state.selectedWorker.some((_v) => _v.employeeId == v.id)
          ),
        }));
      },
      onAlways: () => {
        setTrigger((state) => ({ ...state, workerSearchLoading: false }));
      },
    });
  };

  const onAdd = (value) => async () => {
    try {
      const mandorExists =
        resources.selectedWorker.length === 0 &&
        !resources.selectedWorker.some((v) => v.role === "MANDOR") &&
        value.role !== "MANDOR";

      if (mandorExists) {
        alert.set({
          open: true,
          title: "Mohon Perhatian",
          message:
            "Mandor dalam proyek ini belum tersedia mohon pilih mandor dulu kemudian pilih anggota",
          type: "warning",
          loading: false,
          close: {
            text: "Keluar, Cari Mandor",
          },
          confirm: false,
        });
        return;
      }

      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.concat([value.id]),
      }));

      const data = await FRHooks.apiRoute()
        .project("worker")
        .data({
          projectId: +id,
          employeeId: value.id,
          role: value.role,
          parentId: value.role === "MANDOR" ? null : resources.lastMandorId,
        })
        .sendJson("post", (resp) => resp.data);

      setResources((state) => ({
        ...state,
        selectedWorker: state.selectedWorker.concat([data]),
        worker: state.worker.filter((v) => v.id !== value.id),
        lastMandorId:
          state.selectedWorker
            .concat([data])
            .filter((v) => v.role === "MANDOR")
            .pop()?.id || null,
      }));
    } catch (err) {
    } finally {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.filter((v) => v !== value.id),
      }));
    }
  };

  const onRemove = (value) => async () => {
    try {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.concat([value.id]),
      }));

      const data = await FRHooks.apiRoute()
        .project("deleteWorker", { id: value.id })
        .destroy((resp) => resp.data);

      setResources((state) => ({
        ...state,
        worker: state.worker.concat([data]),
        selectedWorker: state.selectedWorker.filter((_v) => _v.id !== value.id),
        lastMandorId:
          state.selectedWorker
            .filter((_v) => _v.id !== value.id)
            .filter((v) => v.role === "MANDOR")
            .pop()?.id || null,
      }));
    } catch (err) {
    } finally {
      setTrigger((state) => ({
        ...state,
        addWorkerLoading: state.addWorkerLoading.filter((v) => v !== value.id),
      }));
    }
  };

  const onOpenAddWorker = (e) => {
    setResources((state) => ({ ...state, worker: [] }));
    setTrigger((state) => ({
      ...state,
      openWorker: !state.openWorker,
    }));

    if (!trigger.openWorker) {
      searchWorker(e);
    }
  };

  React.useEffect(() => {
    mutation.get(FRHooks.apiRoute().project("detail", { id }).link(), {
      onSuccess: ({ data }) => {
        mutation.setData(data);
      },
    });
    mutation.get(FRHooks.apiRoute().project("listWorkers", { id }).link(), {
      onSuccess: ({ data }) => {
        const tmp = [];
        data.forEach(({ members, ...other }) => {
          tmp.push(other);
          members.forEach((v) => tmp.push(v));
        });
        setResources((state) => ({
          ...state,
          selectedWorker: tmp,
          lastMandorId: data.length > 0 ? data[data.length - 1].id : null,
        }));
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
        <Grid item xs={trigger.openWorker ? 4 : 8}>
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

              <ListItem dense>
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
            </List>
          </Paper>
        </Grid>

        <Grid item xs={trigger.openWorker ? 8 : 4}>
          <FORM.ListWorker
            open={trigger.openWorker}
            loading={mutation.loading}
            searchLoading={trigger.workerSearchLoading}
            addWorkerLoading={trigger.addWorkerLoading}
            workers={resources.worker}
            selectedWorkers={resources.selectedWorker}
            onAdd={onAdd}
            onRemove={onRemove}
            onOpen={onOpenAddWorker}
            searchWorker={searchWorker}
          />
        </Grid>
      </Grid>

      <FORM.Create
        open={trigger.form}
        mutation={mutation}
        route={FRHooks.apiRoute}
        snackbar={enqueueSnackbar}
        onOpen={onOpen}
      />
    </ProjectTemplate>
  );
};
