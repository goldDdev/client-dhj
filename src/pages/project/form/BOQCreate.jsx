import React from "react";
import { DialogForm, FieldSet, Select } from "@components/base";
import { LoadingButton } from "@mui/lab";
import { Button, Stack, TextField } from "@mui/material";
import * as utils from "@utils/";

const BOQCreate = ({ trigger, onOpen, mutation, onSubmit }) => (
  <DialogForm
    open={trigger.form}
    onClose={onOpen}
    title="Tambah BOQ"
    maxWidth="sm"
    content={{
      children: (
        <Stack spacing={2} direction="column">
          <TextField
            label="Nama"
            value={mutation.data.name || ""}
            onChange={(e) => mutation.setData({ name: e.target.value })}
            error={mutation.error("name")}
            helperText={mutation.message("name")}
          />

          <FieldSet disabledDivider>
            <TextField
              label="Satuan"
              value={mutation.data.typeUnit || ""}
              onChange={(e) => mutation.setData({ typeUnit: e.target.value })}
              error={mutation.error("typeUnit")}
              helperText={mutation.message("typeUnit")}
            />

            <TextField
              label="Unit"
              value={mutation.data.unit}
              onChange={(e) => {
                if (Number.isInteger(+e.target.value)) {
                  mutation.setData({
                    unit: +e.target.value,
                    totalPrice: +e.target.value * mutation.data.price,
                  });
                }
              }}
              error={mutation.error("unit")}
              helperText={mutation.message("unit")}
            />
          </FieldSet>

          <TextField
            label="Harga"
            value={mutation.data.price}
            onChange={(e) => {
              if (Number.isInteger(+e.target.value)) {
                mutation.setData({
                  price: +e.target.value,
                  totalPrice: +e.target.value * mutation.data.unit,
                });
              }
            }}
            error={mutation.error("price")}
            helperText={mutation.message("price")}
          />

          <TextField disabled value={mutation.data.totalPrice} />

          <Select
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
          />
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

export default React.memo(BOQCreate);
