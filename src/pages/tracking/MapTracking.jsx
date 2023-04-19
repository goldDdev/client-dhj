import React, { useEffect } from "react";
import FRHooks from "frhooks";
import moment from "moment";
import { useSnackbar } from "notistack";
import { Autocomplete, Stack, Paper, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MainTemplate from "@components/templates/MainTemplate";
import DataTable from "../../components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import * as utils from "@utils";

import '../../assets/leaflet.scss';

const columns = (t) => [
  {
    label: 'Nama',
    value: (value) => value.name,
  },
  {
    label: t("role"),
    value: (value) => utils.typesLabel(value.role),
  },
  {
    label: 'Waktu',
    value: (value) => moment(value.created_at).format("DD-MM-yyyy HH:mm"),
  },
];

const MapTracking = () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: `${v.name} (${v.location})` })),
    defaultValue: [],
    disabledOnDidMount: false,
    getData: (resp) => {
      if (!resp.length) return;
      const first = resp[0];
      tracks.setQuery({ projectId: first.id, project: first.name, date: moment().format("yyyy-MM-DD") });
    }
  });
  
  const tracks = FRHooks.useFetch(apiRoute.tracking.index, {
    defaultValue: [],
    disabledOnDidMount: false,
    selector: (resp) => resp.data,
  });

  useEffect(() => {
    // NOTE : interval 3 min to refetch data trackings
    setInterval(() => {
      console.log('Refetching...', new Date())
      tracks.refresh()
    }, 3*60000); // 1m=60s=60000ms
  },[])

  return (
    <MainTemplate
      title={t("project")}
    >
      <Stack
        spacing={2}
        direction="row"
        mb={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Paper elevation={0} sx={{ width: "50%" }}>
          <Autocomplete
            id="asynchronous"
            freeSolo
            fullWidth
            value={{ id: tracks.query.projectId, name: tracks.query.project }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={projects.data}
            onOpen={() => {
              projects.clear();
            }}
            loading={false}
            onChange={(e, v, r) => {
              if (r === "clear") {
                tracks.clearOnly(["projectId", "project"]);
              } else {
                tracks.setQuery({ ...tracks.query, projectId: v.id, project: v.name });
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id} children={option.name} />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proyek"
                value={tracks.query.project || undefined}
                onChange={(e) => tracks.setQuery({ project: e.target.value })}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {projects.loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </Paper>
        <TextField
          type="date"
          sx={{ width: '20%' }}
          value={tracks.query.date || undefined}
          onChange={(e) => tracks.setQuery({ ...tracks.query, date: e.target.value })}
        />
      </Stack>

      <Paper elevation={0} variant="outlined" sx={{ minHeight: '500px' }}>
        {tracks.query.projectId && tracks.query.date ? (
          <>
            {tracks.data.length > 0 ? (
              <Box>
                <Box sx={{ height: '500px', width: '100%' }}>
                  <MapContainer center={[tracks.data[0].project_latitude, tracks.data[0].project_longitude]} zoom={15} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {tracks.data.map((track, i) => (
                      <Marker key={i} position={[track.latitude, track.longitude]}>
                        <Popup>
                          {track.name} {t(track.role)}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ ml: 2 }}>Daftar Karyawan : {tracks.query.project}</Typography>
                  <DataTable
                    data={tracks.data}
                    loading={tracks.loading}
                    column={columns(t)}
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="h6" textAlign="center" sx={{ m: 2 }}>
                Data tidak tersedia, silahkan coba ubah pencarian.
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="h6" textAlign="center" sx={{ m: 2 }}>
            Mohon Pilih Project & Tanggal
          </Typography>
        )}
      </Paper>
    </MainTemplate>
  );
};

export default MapTracking;
