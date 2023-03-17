import HeadCell from "./HeadCell";
import RowLoading from "./RowLoading";
import {
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableHead,
  Table,
} from "@mui/material";
import _ from "lodash";

const DataTable = ({
  loading,
  order,
  orderBy,
  column,
  data,
  onOrder,
  selected,
  pagination,
  hover,
  tableProps,
  container,
  row,
  disableHeader,
  headProps
}) => {
  return (
    <div>
      <TableContainer {...container}>
        <Table {...tableProps}>
          {disableHeader ? null : (
            <TableHead {...headProps}>
              <TableRow>
                {column.map(({ ...props }, i) => (
                  <HeadCell
                    key={`th-${i}`}
                    order={order}
                    orderBy={orderBy}
                    onOrder={onOrder}
                    {...props}
                  />
                ))}
              </TableRow>
            </TableHead>
          )}

          <TableBody component="tbody">
            <>
              {loading && <RowLoading count={column.length} />}

              {!loading && data.length === 0 && (
                <TableRow sx={{ backgroundColor: "white !important" }}>
                  <TableCell
                    variant="body"
                    colSpan={column.length}
                    align="center"
                  >
                    Data Tidak Tersedia
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                data.length > 0 &&
                data.map((_data, i) => (
                  <TableRow
                    key={`row-${i}`}
                    component="tr"
                    hover={hover}
                    selected={selected ? selected(_data) : undefined}
                    {...row}
                  >
                    {column.map(({ value, ...col }, j) => (
                      <TableCell key={`row-${i}-cell-${j}`} {...col}>
                        {value(_data, i)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </>
          </TableBody>
        </Table>
      </TableContainer>
      {pagination ? (
        <TablePagination component={"div"} {...pagination} />
      ) : null}
    </div>
  );
};

export default DataTable;

DataTable.defaultProps = {
  loading: false,
  data: [],
};
