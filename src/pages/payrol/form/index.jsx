// import {
//   List,
//   ListItemText,
//   ListItem as MuiListItem,
//   styled,
// } from "@mui/material";
// import * as utils from "@utils/";
// import React from "react";

// const ListItem = styled(MuiListItem)(({ theme }) => ({
//   paddingTop: 0,
//   paddingBottom: 0,
// }));

// export const Employee = ({ employee }) => {
//   return (
//     <List dense>
//       <ListItem>
//         <ListItemText primary={"Nama"} secondary={employee.name || "-"} />
//       </ListItem>

//       <ListItem>
//         <ListItemText
//           primary={"Role"}
//           secondary={utils.typesLabel(employee.role)}
//         />
//       </ListItem>

//       <ListItem>
//         <ListItemText
//           primary={"Karyawan ID"}
//           secondary={employee.cardID || "-"}
//         />
//       </ListItem>
//     </List>
//   );
// };

import { DialogForm } from "@components/base";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import React from "react";

export const OtherForm = ({ open, onOpen, other, setOther, onSubmit }) => {
  return (
    <DialogForm
      open={open}
      onClose={onOpen}
      title="Biaya Lainya"
      maxWidth="md"
      content={{
        sx: { p: 0 },
        children: (
          <Stack direction="column" flexGrow={1}>
            <List dense>
              <ListItem divider sx={{ py: 0 }}>
                <ListItemText primary="Nama" secondary={other.name || ""} />
              </ListItem>
            </List>

            <List dense>
              <ListItem divider sx={{ py: 0 }}>
                <ListItemText primary="Role" secondary={other.role || ""} />
              </ListItem>
            </List>

            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ borderBottom: 0 }} align="left">
                    <TextField
                      label="Potongan Lainya"
                      variant="standard"
                      value={other.otherCut || 0}
                      onChange={(e) => {
                        setOther((state) => ({
                          ...state,
                          otherCut: +e.target.value,
                        }));
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 0 }} align="center">
                    <TextField
                      label="Keterangan"
                      variant="standard"
                      value={other.noteOtherCut || ""}
                      onChange={(e) => {
                        setOther((state) => ({
                          ...state,
                          noteOtherCut: e.target.value,
                        }));
                      }}
                    />
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ borderBottom: 0 }} align="left">
                    <TextField
                      label="Tambahan Lainya"
                      variant="standard"
                      value={other.otherAdditional || 0}
                      onChange={(e) => {
                        setOther((state) => ({
                          ...state,
                          otherAdditional: +e.target.value,
                        }));
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: 0 }} align="center">
                    <TextField
                      label="Keterangan"
                      variant="standard"
                      value={other.noteOtherAdditional || ""}
                      onChange={(e) => {
                        setOther((state) => ({
                          ...state,
                          noteOtherAdditional: e.target.value,
                        }));
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
              disableElevation
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              Simpan Perubahan
            </LoadingButton>
          </>
        ),
      }}
    />
  );
};
