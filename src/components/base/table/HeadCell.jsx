import { Box, TableCell, TableSortLabel, Typography } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

const HeadCell = ({ sortKey, label, order, orderBy, onOrder, head }) => {
  let disabledTypography = false;
  let noWrap = true;
  let otherHead = undefined;

  if (head) {
    const { noWrap: no, disabledTypography: disabled, ...other } = head;
    noWrap = no;
    disabledTypography = disabled;
    otherHead = other;
  }

  return (
    <TableCell variant="head" {...otherHead}>
      {sortKey && orderBy && onOrder && (
        <TableSortLabel
          active={orderBy === sortKey || false}
          direction={order}
          onClick={() => {
            onOrder(sortKey);
          }}
        >
          {disabledTypography && label}

          {!disabledTypography && (
            <Typography variant="inherit" noWrap={noWrap} fontWeight={600}>
              {label}
            </Typography>
          )}

          {orderBy && orderBy === sortKey ? (
            <Box component="span" sx={visuallyHidden}>
              {order === "desc" ? "sortKeyed descending" : "sorted ascending"}
            </Box>
          ) : null}
        </TableSortLabel>
      )}

      {!sortKey && !disabledTypography && (
        <Typography variant="inherit" noWrap={noWrap} fontWeight={600}>
          {label}
        </Typography>
      )}

      {!sortKey && disabledTypography && label}
    </TableCell>
  );
};

export default HeadCell;

HeadCell.defaultProps = {
  sort: false,
  orderBy: "asc",
};
