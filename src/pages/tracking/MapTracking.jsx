import React, { useEffect } from "react";
import FRHooks from "frhooks";
import moment from "moment";
import {
  Autocomplete,
  Stack,
  Paper,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  MapContainer,
  Marker,
  TileLayer,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import MainTemplate from "@components/templates/MainTemplate";
import DataTable from "../../components/base/table/DataTable";
import apiRoute from "@services/apiRoute";
import * as utils from "@utils";

import "../../assets/leaflet.scss";

const columns = () => [
  {
    label: "Nama",
    value: (value) => value.name,
  },
  {
    label: "Role",
    value: (value) => utils.typesLabel(value.role),
  },
  {
    label: "Waktu",
    value: (value) => moment(value.created_at).format("DD-MM-yyyy HH:mm"),
  },
];

const MapTracking = () => {
  const [coordinate, setCoordinate] = React.useState({
    latitude: 0,
    longitude: 0,
  });

  const [link, setLink] = React.useState(apiRoute.tracking.index);

  const projects = FRHooks.useFetch(apiRoute.centerLocation.all, {
    selector: (resp) => resp.data,
    defaultValue: [],
  });

  const tracks = FRHooks.useFetch(link, {
    defaultValue: [],
    disabledOnDidMount: true,
    selector: (resp) => resp.data,
    deps: [link],
  });

  useEffect(() => {
    // NOTE : interval 3 min to refetch data trackings
    setInterval(() => {
      console.log("Refetching...", new Date());
      tracks.refresh();
    }, 3 * 60000); // 1m=60s=60000ms
  }, []);

  return (
    <MainTemplate title={"Proyek atau Pusat Lokasi"}>
      <Stack
        spacing={2}
        direction={{
          xs: "column",
          sm: "column",
          md: "column",
          lg: "row",
          xl: "row",
        }}
        mb={2}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Paper
          elevation={0}
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "50%",
              xl: "50%",
            },
          }}
        >
          <Autocomplete
            id="asynchronous"
            freeSolo
            fullWidth
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={projects.data}
            loading={projects.loading}
            onChange={(e, v, r) => {
              if (r === "selectOption") {
                if (v) {
                  setLink(
                    v.type === "PROJECT"
                      ? apiRoute.tracking.index
                      : apiRoute.tracking.location
                  );
                  setCoordinate({
                    latitude: v.latitude,
                    longitude: v.longitude,
                  });

                  tracks.setQuery({
                    [v.type === "PROJECT" ? "projectId" : "locationId"]: v.id,
                  });
                }
              }

              if (r === "clear") {
                projects.clear();
                tracks.clear()
                setLink(apiRoute.tracking.index);
                setCoordinate({
                  latitude: 0,
                  longitude: 0,
                });
              }
            }}
            onInputChange={(e, v, r) => {
              if (r === "input") {
                projects.setQuery({ name: v });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proyek"
                value={tracks.query.project || undefined}
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
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "20%",
              xl: "20%",
            },
          }}
          value={tracks.query.date || ""}
          onChange={(e) => tracks.setQuery({ date: e.target.value })}
        />
      </Stack>

      <Paper elevation={0} variant="outlined" sx={{ minHeight: "500px" }}>
        {tracks.query.projectId && tracks.query.date ? (
          <>
            {tracks.data.length > 0 ? (
              <Box>
                <Box sx={{ height: "500px", width: "100%" }}>
                  <MapContainer
                    center={[coordinate.latitude, coordinate.longitude]}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: "500px", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <CircleMarker
                      center={[
                        tracks.data[0].project_latitude,
                        tracks.data[0].project_longitude,
                      ]}
                      pathOptions={{ color: "red" }}
                      radius={100}
                    >
                      {/* <Tooltip>Radius 100m</Tooltip> */}
                    </CircleMarker>
                    {tracks.data.map((track, i) => (
                      <Marker
                        key={i}
                        position={[track.latitude, track.longitude]}
                      >
                        <Tooltip>
                          {track.name} ({utils.typesLabel(track.role)})
                        </Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ ml: 2 }}>
                    Daftar Karyawan : {tracks.query.project}
                  </Typography>
                  <DataTable
                    data={tracks.data}
                    loading={tracks.loading}
                    column={columns()}
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
