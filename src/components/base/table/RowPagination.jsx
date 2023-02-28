import { Pagination, PaginationItem, Stack, Typography } from "@mui/material";

const RowPagination = ({ total, count, page, onPageChange }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
    >
      <div>
        <Typography variant="subtitle1">Total {total}</Typography>
      </div>

      <Pagination
        count={count}
        page={page}
        hideNextButton={count === 1}
        renderItem={(item) => <PaginationItem {...item} />}
        onChange={(e, value) => onPageChange(value)}
      />
    </Stack>
  );
};

export default RowPagination;
