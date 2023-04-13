import {
  Box,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import apiRoute from "@services/apiRoute";
import FRHooks from "frhooks";
import * as utils from "@utils/";
import { useParams } from "react-router-dom";
import React from "react";

const TableLable = styled(TableCell)(({}) => ({ whiteSpace: "nowrap" }));

export default () => {
  const { id } = useParams();

  const { data } = FRHooks.useFetch([apiRoute.payrol.detail, { id }], {
    defaultValue: {},
    selector: (resp) => resp.data,
  });

  React.useEffect(() => {
    if (Object.keys(data).length === 0) return;
    window.print();
    window.close()
  }, [data]);

  return (
    <Box>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableLable padding="checkbox">Nama</TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell>{data.employee?.name || "-"}</TableCell>
          </TableRow>

          <TableRow>
            <TableLable padding="checkbox">No Karyawan</TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell>{data.employee?.cardID || "-"}</TableCell>
          </TableRow>

          <TableRow>
            <TableLable padding="checkbox">Role</TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell>{utils.typesLabel(data.role) || "-"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography
        align="center"
        variant="h6"
        mt={2}
        sx={{ textDecoration: "underline" }}
      >
        Slip Gaji Karyawan
      </Typography>

      <Typography align="center" variant="body1">
        {`Periode ${utils.getMonth(data.month)} ${data.year}`}
      </Typography>

      <Typography variant="body1" gutterBottom mt={2}>
        Potongan Karyawan
      </Typography>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableLable padding="checkbox">Gaji Pokok</TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell align="right">
              {utils.formatCurrency(data.salary || 0)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableLable padding="checkbox">Upah Lembur</TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell align="right">
              {utils.formatCurrency(data.totalOvertimePrice || 0)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableLable padding="checkbox">
              <ListItemText
                primary="Tambahan Lainya"
                secondary={data.noteOtherAdditional || "-"}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell align="right">{utils.formatCurrency(data.otherAdditional || 0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant="body1" gutterBottom mt={2}>
        Potongan Karyawan
      </Typography>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableLable padding="checkbox">
              <ListItemText
                primary="Keterlambatan"
                secondary={utils.toHoursAndMinutes(data.totalLateDuration || 0)}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell align="right">
              {utils.formatCurrency(data.totalLatePrice || 0)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableLable padding="checkbox">
              <ListItemText
                primary="Potongan Lainya"
                secondary={data.noteOtherCut || "-"}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </TableLable>
            <TableCell align="center" padding="checkbox">
              :
            </TableCell>
            <TableCell align="right">{utils.formatCurrency(data.otherCut || 0)}</TableCell>
          </TableRow>

          <TableRow>
            <TableLable colSpan={3} padding="checkbox" sx={{ border: "none" }}>
              &nbsp;
            </TableLable>
          </TableRow>
        </TableBody>

        <TableRow>
          <TableLable padding="checkbox">
            <ListItemText
              primary="Gaji Bersih"
              primaryTypographyProps={{ variant: "subtitle1" }}
            />
          </TableLable>
          <TableCell align="center" padding="checkbox">
            :
          </TableCell>
          <TableCell align="right">
            {utils.formatCurrency(data.total || 0)}
          </TableCell>
        </TableRow>
      </Table>
    </Box>
  );
};
