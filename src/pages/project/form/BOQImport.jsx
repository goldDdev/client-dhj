import React from "react";
import { DialogForm } from "@components/base";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as utils from "@utils/";
import { Link } from "react-router-dom";

const examples = [
  {
    name: "Seng Gelombang",
    typeUnit: "lbr",
    unit: 25,
    price: 65000,
    type: "CIVIL",
  },
  {
    name: "Pipa Suling PVC 2",
    typeUnit: "bh",
    unit: 40,
    price: 100000,
    type: "PIPING",
  },
  { name: "Aki", typeUnit: "bh", unit: 2, price: 150000, type: "ELECTRICAL" },
];

const BOQImport = ({
  data,
  loading,
  trigger,
  onOpen,
  onUpload,
  onSubmit,
  filename,
}) => {
  const failData = data.filter((v) =>
    !v.name
      ? true
      : !v.typeUnit
      ? true
      : !v.unit
      ? true
      : !v.type
      ? true
      : false
  );

  return (
    <DialogForm
      open={trigger.import}
      onClose={onOpen}
      title="Import BOQ"
      maxWidth="sm"
      content={{
        children: (
          <Stack spacing={1.5} direction="column">
            <TextField
              type="file"
              onChange={onUpload}
              error={failData.length > 0}
              helperText={
                failData.length > 0 ? "Mohon untuk melengkapi data." : ""
              }
            />

            {filename ? (
              <Typography gutterBottom>
                {filename} ({data.length})
              </Typography>
            ) : null}

            <Paper
              variant="outlined"
              sx={{
                backgroundColor: "whitesmoke",
                p:1
              }}
            >
              <Typography>Contoh: </Typography>
              <Typography gutterBottom>Tipe: <Typography component={"span"} fontWeight={600}>CIVIL, ELECTRICAL dan PIPING</Typography> </Typography>
              <TableContainer></TableContainer>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama</TableCell>
                      <TableCell align="center">Satuan</TableCell>
                      <TableCell align="center">Unit</TableCell>
                      <TableCell align="center">Tipe</TableCell>
                      <TableCell align="center">Harga</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {examples.map((val, r) => {
                      return (
                        <TableRow key={r}>
                          <TableCell>{val.name || "Kosong"}</TableCell>

                          <TableCell align="center">
                            {val.typeUnit || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {val.unit || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {val.type || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {Number(val.price || 0)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {failData.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        component="th"
                        padding="checkbox"
                        align="center"
                      >
                        Row
                      </TableCell>
                      <TableCell>Nama</TableCell>
                      <TableCell align="center">Satuan</TableCell>
                      <TableCell align="center">Unit</TableCell>
                      <TableCell align="center">Tipe</TableCell>
                      <TableCell align="center">Harga</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {failData.map((val, r) => {
                      return (
                        <TableRow key={r}>
                          <TableCell align="center">{val.row + 1}</TableCell>
                          <TableCell>{val.name || "Kosong"}</TableCell>

                          <TableCell align="center">
                            {val.typeUnit || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {val.unit || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {val.type || "Kosong"}
                          </TableCell>

                          <TableCell align="center">
                            {utils.formatCurrency(Number(val.price || 0))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Stack>
        ),
      }}
      actions={{
        sx: {
          justifyContent: "space-between",
        },
        children: (
          <>
            <div style={{ marginLeft: '16px' }}>
              <Link to={"https://api.app-dhj.com/web/boqs"}>
                Unduh Format Import
              </Link>
            </div>

            <Stack direction={"row"} spacing={1} mr={2}>
              <Button variant="outlined" onClick={onOpen}>
                Batal
              </Button>
              <LoadingButton
                disabled={data.length === 0 || failData.length > 0}
                loading={loading}
                disableElevation
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Import BOQ
              </LoadingButton>
            </Stack>
          </>
        ),
      }}
    />
  );
};

export default React.memo(BOQImport);
