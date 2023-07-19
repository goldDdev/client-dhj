import React from "react";
import { DialogForm, FieldSet } from "@components/base";
import { LoadingButton } from "@mui/lab";
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import * as utils from "@utils/";
import * as Filter from "../filter";

const EventCreate = ({
  open,
  mutation,
  snackbar,
  table,
  onOpen,
  route,
  type,
}) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Milestone"
      maxWidth={["actual", "revise1", "revise2"].includes(type) ? "xs" : "sm"}
      content={{
        children: (
          <Stack spacing={1.5} direction="column">
            {type === "full" ? (
              <TextField
                fullWidth
                disabled={mutation.loading || mutation.processing}
                label="Nama Event"
                value={mutation.data.title || ""}
                onChange={(e) => mutation.setData({ title: e.target.value })}
                onBlur={async () => mutation.validate("title")}
                error={mutation.error("title")}
                helperText={mutation.message("title")}
                InputProps={{
                  endAdornment:
                    mutation.loading || mutation.processing ? (
                      <CircularProgress size={20} />
                    ) : null,
                }}
              />
            ) : null}

            {type === "full" ? (
              <FieldSet disabledDivider label="Tanggal Plan">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.datePlan}
                  onChange={(e) =>
                    mutation.setData({
                      datePlan: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("datePlan")}
                  error={mutation.error("datePlan")}
                  helperText={mutation.message("datePlan")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={type === "full" ? "Waktu" : "Waktu Aktual"}
                  value={
                    mutation.data[
                      type === "full" ? "timePlan" : "actualTime"
                    ] || ""
                  }
                  onChange={(e) =>
                    mutation.setData({
                      [type === "full" ? "timePlan" : "actualTime"]:
                        e.target.value,
                    })
                  }
                  onBlur={async () =>
                    mutation.validate(
                      type === "full" ? "timePlan" : "actualTime"
                    )
                  }
                  error={mutation.error(
                    type === "full" ? "timePlan" : "actualTime"
                  )}
                  helperText={mutation.message(
                    type === "full" ? "timePlan" : "actualTime"
                  )}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "revise1" ? (
              <FieldSet disabledDivider label="Tanggal Revise 1">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.revise1}
                  onChange={(e) =>
                    mutation.setData({
                      revise1: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("revise1")}
                  error={mutation.error("revise1")}
                  helperText={mutation.message("revise1")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.reviseTime1}
                  onChange={(e) =>
                    mutation.setData({
                      reviseTime1: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("reviseTime1")}
                  error={mutation.error("reviseTime1")}
                  helperText={mutation.message("reviseTime1")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "revise2" ? (
              <FieldSet disabledDivider label="Tanggal Revise 2">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.revise2}
                  onChange={(e) =>
                    mutation.setData({
                      revise2: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("revise2")}
                  error={mutation.error("revise2")}
                  helperText={mutation.message("revise2")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.reviseTime2}
                  onChange={(e) =>
                    mutation.setData({
                      reviseTime2: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("reviseTime2")}
                  error={mutation.error("reviseTime2")}
                  helperText={mutation.message("reviseTime2")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "actual" ? (
              <FieldSet disabledDivider label="Tanggal Aktual">
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Tanggal"}
                  value={mutation.data.actualDate || ""}
                  onChange={(e) =>
                    mutation.setData({
                      actualDate: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("actualDate")}
                  error={mutation.error("actualDate")}
                  helperText={mutation.message("actualDate")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="date"
                />

                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  disabled={mutation.loading || mutation.processing}
                  label={"Waktu"}
                  value={mutation.data.actualTime || ""}
                  onChange={(e) =>
                    mutation.setData({
                      actualTime: e.target.value,
                    })
                  }
                  onBlur={async () => mutation.validate("actualTime")}
                  error={mutation.error("actualTime")}
                  helperText={mutation.message("actualTime")}
                  InputProps={{
                    endAdornment:
                      mutation.loading || mutation.processing ? (
                        <CircularProgress size={20} />
                      ) : null,
                  }}
                  sx={{ width: "75%" }}
                  type="time"
                />
              </FieldSet>
            ) : null}

            {type === "full" ? (
              <FieldSet
                label="Status Event"
                stackProps={{
                  direction: "row",
                  spacing: 1,
                  justifyContent: "flex-start",
                }}
              >
                {Object.entries(utils.komStatus).map(([k, v]) => (
                  <Filter.ChipKom
                    disableElevation
                    size="small"
                    key={k}
                    status={k}
                    color={mutation.data.status === k ? "primary" : "inherit"}
                    variant={
                      mutation.data.status === k ? "contained" : "outlined"
                    }
                    onClick={() => {
                      mutation.setData({ status: k });
                    }}
                  />
                ))}
              </FieldSet>
            ) : null}

            {false ? (
              <FieldSet
                label="Deskripsi"
                stackProps={{ direction: "column", spacing: 2 }}
              >
                <div id="description"></div>
                <TextField
                  fullWidth
                  id="description"
                  multiline
                  rows={2}
                  disabled={mutation.loading || mutation.processing}
                  value={mutation.data.description || ""}
                  onChange={(e) =>
                    mutation.setData({ description: e.target.value })
                  }
                  placeholder="Tulis deskripsi disini"
                  sx={{ width: "100%" }}
                />
              </FieldSet>
            ) : null}
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
              disabled={mutation.processing || mutation.loading}
              disableElevation
              variant="contained"
              color="primary"
              onClick={() => {
                mutation.post(route().project("kom").link(), {
                  method: mutation.isNewRecord ? "post" : "put",
                  except: [].concat(mutation.isNewRecord ? ["id"] : []),
                  validation: true,
                  onSuccess: ({ data }) => {
                    snackbar(`Event Berhasil Ditambahkan`);
                    onOpen();
                    if (table && mutation.isNewRecord) {
                      table.add(data, "start");
                    } else {
                      table.update((v) => v.id === mutation.data.id, data);
                    }
                  },
                });
              }}
            >
              {mutation.isNewRecord ? "Tambah Baru" : "Simpan Perubahan"}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};

export default React.memo(EventCreate);
