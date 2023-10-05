import React from "react";
import _ from "lodash";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Collapse,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as BASE from "@components/base";
import * as utils from "@utils/";
import PhoneFormat from "@components/base/mask/PhoneFormat";

const EmployeeCreate = ({isCurr, open, mutation, onOpen, onSubmit, validate }) => {
  return (
    <BASE.DialogForm
      open={open}
      onClose={onOpen}
      title={"Form Karyawan"}
      content={{
        children: (
          <Stack spacing={2}>
            <BASE.Select
              id="empRole"
              label={"Role"}
              name="role"
              menu={utils.workerMobileTypes.map((v) => ({
                text: utils.typesLabel(v),
                value: v,
              }))}
              value={mutation.data.role === "" ? "WORKER" : mutation.data.role}
              setValue={mutation.setData}
              error={mutation.error("role")}
              helperText={mutation.message("role")}
            />

            {mutation.data.role === "MANDOR" ? (
              <BASE.Select
                id="empType"
                label={"Tipe"}
                name="type"
                menu={[
                  { text: "Pilih Tipe", value: "00" },
                  ...utils.boqTypes.map((v) => ({
                    text: v,
                    value: v,
                  })),
                ]}
                value={mutation.data.type || "00"}
                onChange={(e) => {
                  mutation.setData({
                    type: e.target.value === "00" ? null : e.target.value,
                  });
                }}
                error={mutation.error("type")}
                helperText={mutation.message("type")}
              />
            ) : null}

            <TextField
              id="empName"
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
              id="empCard"
              disabled={mutation.loading}
              label={"No. ID Karyawan"}
              value={mutation.data.cardID || ""}
              onChange={(e) => mutation.setData({ cardID: e.target.value })}
              onBlur={validate(mutation.data.id, "cardID")}
              error={mutation.error("cardID")}
              helperText={mutation.message("cardID")}
              InputProps={{
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
              }}
            />

            <TextField
              id="empPN"
              disabled={mutation.loading}
              label={"No HP"}
              value={mutation.data.phoneNumber || ""}
              onChange={(e) =>
                mutation.setData({ phoneNumber: e.target.value })
              }
              onBlur={validate(mutation.data.id, "phoneNumber")}
              error={mutation.error("phoneNumber")}
              helperText={mutation.message("phoneNumber")}
              InputProps={{
                inputProps: {
                  maxLength: 12,
                  minLength: 10,
                },
                endAdornment: mutation.loading ? (
                  <CircularProgress size={20} />
                ) : null,
                inputComponent: PhoneFormat,
              }}
            />

            {mutation.data.role !== "WORKER" ? (
              <>
                <BASE.FieldSet
                  label={"Email(*) dan Password diperlukan jika bukan Pekerja"}
                  labelProps={{ fontWeight: 500 }}
                >
                  <TextField
                    id="empEmail"
                    disabled={mutation.loading}
                    label={"Alamat Email"}
                    value={mutation.data.email || ""}
                    onChange={(e) =>
                      mutation.setData({ email: e.target.value })
                    }
                    onBlur={async () => mutation.validate("email")}
                    error={mutation.error("email")}
                    helperText={mutation.message("email")}
                    InputProps={{
                      endAdornment: mutation.loading ? (
                        <CircularProgress size={20} />
                      ) : null,
                    }}
                    type="email"
                  />
                </BASE.FieldSet>

                <TextField
                  id="empPassword"
                  disabled={mutation.loading}
                  label={"Password"}
                  placeholder="Kosongkan maka password akan sama dengan No. HP"
                  value={mutation.data.password || ""}
                  onChange={(e) =>
                    mutation.setData({ password: e.target.value })
                  }
                  onBlur={async () => mutation.validate("password")}
                  error={mutation.error("password")}
                  helperText={mutation.message("password")}
                  InputProps={{
                    endAdornment: mutation.loading ? (
                      <CircularProgress size={20} />
                    ) : null,
                  }}
                  type="password"
                />
              </>
            ) : null}
          </Stack>
        ),
      }}
      actions={{
        children: (
          <>
            <Button variant="outlined" onClick={onOpen}>
              Keluar
            </Button>
            <Collapse in={isCurr} unmountOnExit sx={{ ml: 1 }} orientation="horizontal">
              <LoadingButton
                loading={mutation.processing}
                disabled={mutation.processing || !mutation.isValid()}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Simpan
              </LoadingButton>
            </Collapse>
          </>
        ),
      }}
    />
  );
};

export default React.memo(EmployeeCreate);
