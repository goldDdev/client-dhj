import React from "react";
import {
  Button,
  Grid,
  ListItem,
  ListItemText,
  Paper,
  List,
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  Skeleton,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";

import Edit from "@mui/icons-material/Edit";
import * as utils from "@utils/";
import * as Dummy from "../../constants/dummy";
import FRHooks, { apiRoute } from "frhooks";
import ProjectTemplate from "@components/templates/ProjectTemplate";
import * as FORM from "./form";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Add, Close, Minimize, PersonAddAlt, Search } from "@mui/icons-material";
import _ from "lodash";
let controller = new AbortController();
export default () => {
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
    openWorker: false,
    workerSearchLoading: false,
  });
  const [resources, setResources] = React.useState({
    worker: [],
    selectedWorker: [],
  });

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

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().project("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData(resp.data);
      },
    });
  };

  const searchWorker = (e) => {
    controller.abort();
    controller = new AbortController();
    mutation.get(apiRoute().employee("index").link(), {
      options: {
        signal: controller.signal,
        params: {
          name: e.target.value,
        },
      },
      onBeforeSend: () => {
        setTrigger((state) => ({ ...state, workerSearchLoading: true }));
      },
      onSuccess: (resp) => {
        setResources((state) => ({
          ...state,
          worker: resp.data.filter(
            (v) => !state.selectedWorker.map((_v) => _v.id).includes(v.id)
          ),
        }));
      },
      onAlways: () => {
        setTrigger((state) => ({ ...state, workerSearchLoading: false }));
      },
    });
  };

  React.useEffect(() => {
    mutation.get(FRHooks.apiRoute().project("detail", { id }).link(), {
      onSuccess: (resp) => {
        mutation.setData(resp.data);
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
          <Paper elevation={0} variant="outlined">
            <Stack
              p={1.5}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                  Daftar Pekerja
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  startIcon={<PersonAddAlt />}
                  disableElevation
                  onClick={(e) => {
                    setResources((state) => ({ ...state, worker: [] }));
                    setTrigger((state) => ({
                      ...state,
                      openWorker: !state.openWorker,
                    }));
                    if (!trigger.openWorker) {
                      searchWorker(e);
                    }
                  }}
                >
                  Tambah Pekerja
                </Button>
              </Box>
            </Stack>

            <Divider />

            <Stack direction="row">
              {trigger.openWorker ? (
                <Stack direction="column" flex={1} p={1}>
                  <TextField
                    placeholder="Cari Pekerja"
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                    onChange={searchWorker}
                  />
                  <Box>
                    <List dense>
                      {trigger.workerSearchLoading ? (
                        <ListItem>
                          <Skeleton width="100%" />
                        </ListItem>
                      ) : null}
                      {!trigger.workerSearchLoading &&
                        resources.worker.map((v, i) => (
                          <ListItem
                            key={i}
                            divider={!(resources.worker.length - 1 === i)}
                            dense
                            secondaryAction={
                              <IconButton
                                onClick={() => {
                                  setResources((state) => ({
                                    ...state,
                                    worker: state.worker.filter(
                                      (_v) => _v.id !== v.id
                                    ),
                                    selectedWorker: state.selectedWorker.concat(
                                      [v]
                                    ),
                                  }));
                                }}
                              >
                                <Add />
                              </IconButton>
                            }
                          >
                            <ListItemText primary={v.name} secondary={v.role} />
                          </ListItem>
                        ))}
                    </List>
                  </Box>
                </Stack>
              ) : null}

              {trigger.openWorker ? (
                <Divider flexItem orientation="vertical" />
              ) : null}

              <Box flex={1}>
                <List dense>
                  {resources.selectedWorker.map((v, i) => (
                    <ListItem
                      key={i}
                      divider={!(resources.selectedWorker.length - 1 === i)}
                      dense
                      secondaryAction={
                        <IconButton
                          onClick={() => {
                            setResources((state) => ({
                              ...state,
                              worker: state.worker.concat([v]),
                              selectedWorker: state.selectedWorker.filter(
                                (_v) => _v.id !== v.id
                              ),
                            }));
                          }}
                        >
                          <Close />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={v.name} secondary={v.role} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Stack>
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
    </ProjectTemplate>
  );
};
