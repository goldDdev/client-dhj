import FRHooks from "frhooks";
import _ from "lodash";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";

export const InventoryForm = ({ open, t, r, mutation, snackbar, table, onOpen }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={`Form Master Data Inventori ${utils.ucword(mutation.data.type)}`}
      content={{
        children: (
          <Stack spacing={2}>

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <TextField
                id="name"
                disabled={mutation.loading}
                label="Nama"
                value={mutation.data.name || ""}
                onChange={(e) => mutation.setData({ name: e.target.value })}
                onBlur={async () => mutation.validate("name")}
                error={mutation.error("name")}
                helperText={mutation.message("name")}
                InputProps={{
                  endAdornment: mutation.loading ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
              />
              <TextField
                id="unit"
                disabled={mutation.loading}
                label="Unit Satuan"
                value={mutation.data.unit || ""}
                onChange={(e) => mutation.setData({ unit: e.target.value })}
                onBlur={async () => mutation.validate("unit")}
                error={mutation.error("unit")}
                helperText={mutation.message("unit")}
                InputProps={{
                  endAdornment: mutation.loading ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
                sx={{ width: '30%' }}
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <TextField
                id="qty"
                type="number"
                disabled={mutation.loading}
                label='Quantity'
                value={mutation.data.qty || "0"}
                onChange={(e) =>
                  mutation.setData({ qty: e.target.value })
                }
                onBlur={async () => mutation.validate("qty")}
                error={mutation.error("qty")}
                helperText={mutation.message("qty")}
                InputProps={{
                  endAdornment: mutation.loading ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
                inputProps={{
                  maxLength: 12,
                }}
              />
              <TextField
                id="minQty"
                type="number"
                disabled={mutation.loading}
                label='Minimal Quantity Pemberitahuan'
                value={mutation.data.minQty || "0"}
                onChange={(e) =>
                  mutation.setData({ minQty: e.target.value })
                }
                onBlur={async () => mutation.validate("minQty")}
                error={mutation.error("minQty")}
                helperText={mutation.message("minQty")}
                InputProps={{
                  endAdornment: mutation.loading ? (
                    <CircularProgress size={20} />
                  ) : null,
                }}
                inputProps={{
                  maxLength: 12,
                }}
              />
            </Stack>
          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onOpen}>
              Batal
            </Button>
            <LoadingButton
              loading={mutation.processing}
              disabled={mutation.processing}
              variant="contained"
              color="primary"
              onClick={() => {
                const isNew = mutation.isNewRecord;
                const editId = mutation.data.id;
                const route = isNew ? FRHooks.apiRoute().inventory("index") : FRHooks.apiRoute().inventory("detail", { id: editId })
                mutation.post(route.link(), {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: mutation.isNewRecord ? ["id"] : [],
                  validation: true,
                  onSuccess: (resp) => {
                    snackbar(t("commonSuccessCreate"));
                    if (isNew) {
                      table.data.unshift(resp.data);
                    } else {
                      const idx = table.data.findIndex(d => d.id === editId)
                      table.data[idx] = resp.data;
                    }
                    mutation.clearData();
                    mutation.clearError();
                    onOpen();
                  },
                });
              }}
            >
              Simpan Perubahan
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
