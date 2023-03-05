import React from "react";
import FRHooks from "frhooks";
import { Box, Stack, TextField, Paper } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { IconButton, Button } from "@components/base";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";
import PersonAdd from "@mui/icons-material/PersonAdd";
import * as Dummy from "../../../constants/dummy";

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();
  const [trigger, setTrigger] = React.useState({
    form: false,
  });

  const table = FRHooks.useTable(FRHooks.apiRoute().employee("index").link(), {
    selector: (resp) => resp.data,
    total: (resp) => resp.meta.total,
  });

  const mutation = FRHooks.useMutation({
    defaultValue: Dummy.employee,
    isNewRecord: (data) => data.id === 0,
    schema: (y) =>
      y.object().shape({
        name: y.string().required().min(3),
        cardID: y.string().required(),
        phoneNumber: y.string().required().min(10).max(12),
      }),
  });

  const onOpen = () => {
    setTrigger((state) => ({ ...state, form: !state.form }));
    mutation.clearData();
    mutation.clearError();
  };

  const onUpdate = (id) => async () => {
    mutation.get(FRHooks.apiRoute().employee("detail", { id }).link(), {
      onBeforeSend: () => {
        onOpen();
      },
      onSuccess: (resp) => {
        mutation.setData(resp.data);
      },
    });
  };

  return (
    <SettingTemplate
      title={t("setting")}
    >

      <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2}>
          <TextField
            id="startTime"
            type="time"
            label="Jam Mulai Kerja"
            disabled={mutation.loading}
            InputLabelProps={{ shrink: true }} 
          />
          <TextField
            id="endTime"
            type="time"
            label="Jam Selesai Kerja"
            disabled={mutation.loading}
            InputLabelProps={{ shrink: true }} 
          />
          <TextField
            id="cut"
            type="number"
            label="Potongan Keterlambatan (Rp/menit)"
            disabled={mutation.loading}
          />
          <TextField
            id="fee"
            type="number"
            label="Tunjangan Lembur (Rp/menit)"
            disabled={mutation.loading}
          />
        </Stack>
        <Box display="flex" gap={1} sx={{ mt: 2 }}>
          <Button variant="outlined">
            {t("cancel")}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => { }}
          >
            {t("save")}
          </LoadingButton>
        </Box>
      </Paper>
    </SettingTemplate >
  );
};
