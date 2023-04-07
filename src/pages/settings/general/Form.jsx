import React from "react";
import FRHooks from "frhooks";
import {
  Stack,
  TextField as MUITextField,
  Paper,
  ListItem,
  ListItemText,
  CircularProgress,
  styled,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import SettingTemplate from "@components/templates/SettingTemplate";

const TextField = styled(MUITextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderColor: "white",
    backgroundColor: theme.palette.grey[100],

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
  },
}));

export default () => {
  const { t, r } = FRHooks.useLang();
  const { enqueueSnackbar } = useSnackbar();

  const mutation = FRHooks.useMutation({
    defaultValue: {},
  });

  const table = FRHooks.useFetch(FRHooks.apiRoute().setting("index").link(), {
    defaultValue: [],
    selector: (resp) => resp.data,
    getData: (value) => {
      mutation.setData(
        value.reduce((p, n) => ({ ...p, [n.code]: n.value }), {})
      );
    },
  });

  return (
    <SettingTemplate
      title={t(["setting", "general"])}
      subtitle="Atur kerja kamu disini"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={2}
        component={Paper}
        variant="outlined"
      >
        <ListItem component="div">
          <ListItemText
            primary="Jam Kerja"
            secondary="Mengatur jam masuk dan pulang."
          />
        </ListItem>
        <Stack direction="row" spacing={1} width={"80%"}>
          <TextField
            InputProps={{
              endAdornment: table.loading ? <CircularProgress size={20} /> : null,
            }}
            type="time"
            label={"Masuk"}
            InputLabelProps={{ shrink: true }}
            value={mutation.data.START_TIME || ""}
            onChange={(e) => {
              mutation.setData({ START_TIME: e.target.value });
            }}
            disabled={table.loading || mutation.processing}
          />

          <TextField
            InputProps={{
              endAdornment: table.loading ? <CircularProgress size={20} /> : null,
            }}
            label={"Pulang"}
            type="time"
            InputLabelProps={{ shrink: true }}
            value={mutation.data.CLOSE_TIME || ""}
            onChange={(e) => {
              mutation.setData({ CLOSE_TIME: e.target.value });
            }}
            disabled={table.loading || mutation.processing}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={2}
        component={Paper}
        variant="outlined"
        mt={2}
      >
        <ListItem component="div">
          <ListItemText
            primary="Lembur"
            secondary="Upan Lembur untuk setiap menit."
          />
        </ListItem>
        <Stack direction="row" spacing={1} width={"80%"}>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            placeholder="Masukan tunjangan lembur disini."
            InputProps={{
              startAdornment: "Rp.",
              endAdornment: table.loading ? <CircularProgress size={20} /> : null,
            }}
            value={mutation.data.OVERTIME_PRICE_PER_MINUTE || ""}
            onChange={(e) => {
              mutation.setData({ OVERTIME_PRICE_PER_MINUTE: e.target.value });
            }}
            disabled={table.loading || mutation.processing}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pr={2}
        component={Paper}
        variant="outlined"
        mt={2}
      >
        <ListItem component="div">
          <ListItemText
            primary="Keterlambatan"
            secondary="Denda keterlambatan yang didapat untuk setiap menitnya."
          />
        </ListItem>
        <Stack direction="row" spacing={1} width={"80%"}>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            placeholder="Masukan denda keterlambatan disini."
            InputProps={{
              startAdornment: "Rp.",
              endAdornment: table.loading ? <CircularProgress size={20} /> : null,
            }}
            value={mutation.data.LATETIME_PRICE_PER_MINUTE || ""}
            onChange={(e) => {
              mutation.setData({ LATETIME_PRICE_PER_MINUTE: e.target.value });
            }}
            disabled={table.loading || mutation.processing}
          />
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <LoadingButton
          loading={mutation.processing}
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => {
            mutation.put(FRHooks.apiRoute().setting("index").link(), {
              onSuccess: ({ data }) => {
                enqueueSnackbar("Perubahan behasil diperbaharui.");
                mutation.setData(
                  data.reduce((p, n) => ({ ...p, [n.code]: n.value }), {})
                );
              },
            });
          }}
        >
          Simpan Perubahan
        </LoadingButton>
      </Stack>
    </SettingTemplate>
  );
};
