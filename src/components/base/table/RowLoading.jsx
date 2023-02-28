import { Skeleton, TableCell, TableRow } from "@mui/material";

const RowLoading = ({ count }) => {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <TableRow key={`row-${i}`}>
          {[...Array(count)].map((_, j) => (
            <TableCell key={`row-${i}_cell-${j}`} variant="body">
              <Skeleton variant="text" width="100%" height={30} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default RowLoading;

RowLoading.defaultProps = {
  count: 1,
};
