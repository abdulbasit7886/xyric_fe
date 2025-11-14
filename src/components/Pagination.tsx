import type { FC } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { PaginatedMeta } from "../types/item";

interface PaginationProps {
  meta: PaginatedMeta | null;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  meta,
  onPageChange,
  isLoading,
}) => {
  if (!meta) return null;

  const { page, totalPages, total } = meta;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="body2" color="text.secondary">
          Showing page {page} of {totalPages} • {total} items total
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => onPageChange(page - 1)}
            disabled={!canPrev || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={() => onPageChange(Number(page) + 1)}
            disabled={!canNext || isLoading}
          >
            Next
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Pagination;
