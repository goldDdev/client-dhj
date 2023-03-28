import React from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { Autocomplete, Stack, Paper, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MainTemplate from "@components/templates/MainTemplate";
import DataTable from "../../components/base/table/DataTable";
import * as utils from "@utils/";
import apiRoute from "@services/apiRoute";
import * as BASE from "@components/base";

import 'leaflet/dist/leaflet.css';

const columns = (table, t) => [
  {
    label: "No",
    value: (_, idx) => {
      return table.pagination.from + idx;
    },
    align: "center",
    size: "small",
  },
  {
    label: t("name"),
    value: (value) => value.name,
  },
  {
    label: t("role"),
    value: (value) => value.name,
  },
];

const MapTracking = () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().tracking("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.data.length,
  });

  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: v.name })),
    defaultValue: [],
    disabledOnDidMount: false,
  });

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
            id="asynchronous-demo"
            freeSolo
            fullWidth
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={projects.data}
            onOpen={() => {
              projects.clear();
            }}
            loading={false}
            onChange={(e, v, r) => {
              if (r === "clear") {
                table.clearOnly(["id", "project"]);
              } else {
                table.setQuery({ id: v.id, project: v.name });
              }
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id} children={option.name} />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Proyek"
                onChange={(e) => projects.setQuery({ name: e.target.value })}
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
        <TextField type="date" />
      </Stack>

      <Paper elevation={0} variant="outlined">
        <Box sx={{ height: '500px', width: '100%' }}>
          <MapContainer center={[1.598333, 101.431827]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[1.598333, 101.431827]}>
              <Popup>
                Budi Subandi (Mandor)
              </Popup>
            </Marker>
            <Marker position={[1.592471, 101.424707]}>
              <Popup>
                Joko Susilo (SPV)
              </Popup>
            </Marker>
            <Marker position={[1.593727, 101.435177]}>
              <Popup>
                Rudi S (Mandor)
              </Popup>
            </Marker>
          </MapContainer>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ ml: 2 }}>Daftar Karyawan : Project A (Dumai)</Typography>
          {/* TODO : show list employee with project assign in prgress for now */}
          <DataTable
            data={[]}
            loading={false}
            column={columns(table, t)}
            pagination={utils.pagination(table.pagination)}
          />
        </Box>
      </Paper>
    </MainTemplate>
  );
};

export default MapTracking;
