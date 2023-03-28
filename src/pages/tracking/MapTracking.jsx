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

  const table = FRHooks.useTable(apiRoute.tracking.index, {
    selector: (resp) => resp.data,
    total: (resp) => resp.data.length,
    // TODO : default query ?
    // queryParams: { projectId: 0, date: "2023-03-19" },
  });

  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: `${v.name} (${v.location})` })),
    defaultValue: [],
    disabledOnDidMount: false,
    // TODO on success set projectId table query
    onSuccess: (resp) => {
      if (!resp.data.length) return;
      const first = resp.data[0];
      console.log('table.query >', first)
      table.setQuery({ projectId: first.id, project: first.name });
    }
  });

  console.log('table.data >', table.data)
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
            value={table.query('projectId') ? { projectId: table.query('id'), project: table.query('project') } : undefined}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            options={projects.data}
            onOpen={() => {
              projects.clear();
            }}
            loading={false}
            onChange={(e, v, r) => {
              if (r === "clear") {
                table.clearOnly(["projectId", "project"]);
              } else {
                table.setQuery({ ...table.query, projectId: v.id, project: v.name });
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
        <TextField
          type="date"
          sx={{ width: '20%' }}
          value={table.query('date') || undefined}
          onChange={(e) => table.setQuery({ ...table.query, date: e.target.value })}
        />
      </Stack>

      <Paper elevation={0} variant="outlined" sx={{ minHeight: '500px' }}>
        {table.query('projectId') && table.query('date') ? (
          <>
            {table.data.length > 0 ? (
              <Box>
                <Box sx={{ height: '500px', width: '100%' }}>
                  {/* table.meta.center */}
                  <MapContainer center={[1.598333, 101.431827]} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {table.data.map((track) => (
                      <Marker position={[track.latitude, track.longitude]}>
                        <Popup>
                          Budi Subandi (Mandor)
                        </Popup>
                      </Marker>
                    ))}
                    {/* <Marker position={[1.592471, 101.424707]}>
                      <Popup>
                        Joko Susilo (SPV)
                      </Popup>
                    </Marker>
                    <Marker position={[1.593727, 101.435177]}>
                      <Popup>
                        Rudi S (Mandor)
                      </Popup>
                    </Marker> */}
                  </MapContainer>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ ml: 2 }}>Daftar Karyawan : {table.query('project')}</Typography>
                  {/* TODO : show list employee with project assign in prgress for now */}
                  <DataTable
                    data={table.data}
                    loading={table.loading}
                    column={columns(table, t)}
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="h6" textAlign="center" sx={{ m: 2 }}>
                Maaf data tidak tersedia, silahkan coba ubah pencarian.
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
