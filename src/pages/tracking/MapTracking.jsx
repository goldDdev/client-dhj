import React from "react";
import FRHooks from "frhooks";
import { useSnackbar } from "notistack";
import { Button, Chip, Paper, Box, Typography } from "@mui/material";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MainTemplate from "@components/templates/MainTemplate";

import 'leaflet/dist/leaflet.css';

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
      <Typography>Project Info : Project A (Dumai)</Typography>
      {/* <Filter.ButtonFilter /> */}

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

        {/* <DataTable
          data={[]}
          loading={false}
          column={columns(table, t, utils, onUpdate)}
          pagination={utils.pagination(table.pagination)}
        /> */}
      </Paper>
    </MainTemplate>
  );
};

export default MapTracking;
