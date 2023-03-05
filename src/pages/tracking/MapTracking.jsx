import React from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { Button, Chip, Paper, Box, Typography } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MainTemplate from "@components/templates/MainTemplate";
import DataTable from "../../components/base/table/DataTable";
import * as utils from "@utils/";
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

  const table = FRHooks.useTable(FRHooks.apiRoute().employee("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  return (
    <MainTemplate
      title={t("project")}
    >
      {/* TODO : Filter by on-going project here */}
      {/* <Filter.ButtonFilter /> */}
      <BASE.Select
        label="Project Selected"
        value={0}
        menu={[
          { text: 'Project A (Dumai)', value: 0 },
          { text: 'Project B (Rumbai)', value: 1 },
          { text: 'Project ABC (Dumai)', value: 2 }
        ]}
      />

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
