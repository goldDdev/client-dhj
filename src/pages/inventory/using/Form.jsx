import React from "react";
import FRHooks from "frhooks";
import _ from "lodash";
import moment from "moment";
import { Stack, TextField, Button, CircularProgress, Autocomplete, Typography } from "@mui/material";
import { Add, ListAlt } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import apiRoute from "@services/apiRoute";
import * as utils from "@utils/";

export const InventoryForm = ({ open, t, r, mutation, snackbar, table, onOpen }) => {
  const projects = FRHooks.useFetch(apiRoute.project.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: `${v.name} (${v.location})` })),
    defaultValue: [],
    disabledOnDidMount: false,
  });
 
  const invetories = FRHooks.useFetch(apiRoute.inventory.index, {
    selector: (resp) => resp.data.map((v) => ({ id: v.id, name: `${v.name} (${utils.ucword(v.type)})`, unit: v.unit })),
    defaultValue: [],
    disabledOnDidMount: false,
  });

  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={`Form Penggunaan Inventori`}
      content={{
        children: (
          <Stack spacing={2}>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <TextField
                type="date"
                label="Tanggal Penggunaan"
                sx={{ width: '35%' }}
                value={moment().format("yyyy-MM-DD") || undefined}
                // onChange={(e) => tracks.setQuery({ ...tracks.query, date: e.target.value })}
              />
              <Autocomplete
                id="asynchronous"
                freeSolo
                fullWidth
                // value={{ id: tracks.query.projectId, name: tracks.query.project }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                options={projects.data}
                onOpen={() => {
                  projects.clear();
                }}
                loading={false}
                onChange={(e, v, r) => {
                  // if (r === "clear") {
                  //   tracks.clearOnly(["projectId", "project"]);
                  // } else {
                  //   tracks.setQuery({ ...tracks.query, projectId: v.id, project: v.name });
                  // }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id} children={option.name} />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pilih Proyek"
                    // value={tracks.query.project || undefined}
                    // onChange={(e) => tracks.setQuery({ project: e.target.value })}
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
            </Stack>

            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Autocomplete
                id="iventory-select"
                freeSolo
                fullWidth
                // value={{ id: tracks.query.projectId, name: tracks.query.project }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                options={invetories.data}
                onOpen={() => {
                  invetories.clear();
                }}
                loading={false}
                onChange={(e, v, r) => {
                  // if (r === "clear") {
                  //   tracks.clearOnly(["projectId", "project"]);
                  // } else {
                  //   tracks.setQuery({ ...tracks.query, projectId: v.id, project: v.name });
                  // }
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id} children={option.name} />
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pilih Item Inventory"
                    // value={tracks.query.project || undefined}
                    // onChange={(e) => tracks.setQuery({ project: e.target.value })}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {invetories.loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
              />
              {/* <TextField
                id="name"
                disabled={mutation.loading}
                label="Pilih Item Inventory"
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
              /> */}
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
                sx={{ width: '30%' }}
              />
              <TextField
                disabled
                id="unit"
                label="Satuan"
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
            <Stack
              p={1.5}
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Button
                variant="text"
                startIcon={<Add />}
                disableElevation
              // onClick={onAddItem()}
              >
                Tambahkan Item
              </Button>
            </Stack>

            <Typography align="center" variant="subheading">Belum ada Item terpilih</Typography>
          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onOpen}>
              {t("cancel")}
            </Button>
            <LoadingButton
              loading={mutation.processing}
              disabled={mutation.processing}
              variant="contained"
              color="primary"
              onClick={() => {
                // const isNew = mutation.isNewRecord;
                // const editId = mutation.data.id;
                // const route = isNew ? FRHooks.apiRoute().inventory("index") : FRHooks.apiRoute().inventory("detail", { id: editId })
                // mutation.post(route.link(), {
                //   method: mutation.isNewRecord ? "post" : "put",
                //   except: mutation.isNewRecord ? ["id"] : [],
                //   validation: true,
                //   onSuccess: (resp) => {
                //     snackbar(t("commonSuccessCreate"));
                //     if (isNew) {
                //       table.data.unshift(resp.data);
                //     } else {
                //       const idx = table.data.findIndex(d => d.id === editId)
                //       table.data[idx] = resp.data;
                //     }
                //     mutation.clearData();
                //     mutation.clearError();
                //     onOpen();
                //   },
                // });
              }}
            >
              {t("save")}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
