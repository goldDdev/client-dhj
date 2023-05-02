import { DialogForm, FieldSet } from "@components/base";
import { Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";

export const Create = ({
  open,
  mutation,
  onOpen,
  onSubmit,
  employees,
  projects,
  onDelete,
}) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Form Plan"
      maxWidth="sm"
      content={{
        children: (
          <Stack spacing={2.5} direction="column">
            <Autocomplete
              loading={employees.loading}
              options={employees.data
                .concat({ id: 0, name: "", role: "" })
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((t) => t.id === value.id)
                )}
              getOptionLabel={(options) => options.name}
              isOptionEqualToValue={(options, value) => {
                return options.name === value.name;
              }}
              value={{
                id: mutation.data.employeeId,
                name: mutation.data.name,
                role: mutation.data.role,
              }}
              onInputChange={(e, v, r) => {
                if (r === "input") {
                  employees.setQuery({ name: v });
                }

                if (r === "clear") {
                  mutation.setData({
                    employeeId: 0,
                    name: "",
                    role: "",
                  });
                }
              }}
              onChange={(e, v, r) => {
                if (r === "selectOption") {
                  mutation.setData({
                    employeeId: v.id,
                    name: v.name,
                    role: v.role,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Karyawan"
                  error={mutation.error("employeeId")}
                  helperText={mutation.message("employeeId")}
                />
              )}
              onOpen={() => {
                employees.refresh();
              }}
            />

            <Autocomplete
              loading={projects.loading}
              options={projects.data
                .concat({ id: 0, name: "" })
                .filter(
                  (value, index, self) =>
                    index === self.findIndex((t) => t.id === value.id)
                )}
              getOptionLabel={(options) => options.name}
              isOptionEqualToValue={(options, value) => {
                return options.id === value.id;
              }}
              value={{
                id: mutation.data.projectId,
                name: mutation.data.projectName,
              }}
              onInputChange={(e, v, r) => {
                if (r === "input") {
                  projects.setQuery({ name: v });
                }

                if (r === "clear") {
                  mutation.setData({
                    projectId: 0,
                    projectName: "",
                  });
                }
              }}
              onChange={(e, v, r) => {
                if (r === "selectOption") {
                  mutation.setData({
                    projectId: v.id,
                    projectName: v.name,
                  });
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Proyek"
                  error={mutation.error("projectId")}
                  helperText={mutation.message("projectId")}
                />
              )}
              onOpen={() => {
                projects.refresh();
              }}
            />

            <FieldSet label="Tanggal Plan">
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Mulai"
                type="date"
                value={mutation.data.startDate || ""}
                onChange={(e) =>
                  mutation.setData({ startDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                error={mutation.error("startDate")}
                helperText={mutation.message("startDate")}
              />
              <TextField
                disabled={mutation.loading || mutation.processing}
                label="Tanggal Berakhir"
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                value={mutation.data.endDate || ""}
                onChange={(e) => mutation.setData({ endDate: e.target.value })}
                inputProps={{ min: mutation.data.startDate }}
                error={mutation.error("endDate")}
                helperText={mutation.message("endDate")}
              />
            </FieldSet>

            {mutation.isNewRecord ? null : (
              <FieldSet label="Hapus Plan Mingguan">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={onDelete(mutation.data.id)}
                >
                  Hapus
                </Button>
              </FieldSet>
            )}
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
              onClick={onSubmit}
            >
              {mutation.isNewRecord ? "Tambah Baru" : "Simpan Perubahan"}
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
