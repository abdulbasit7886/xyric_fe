import type { FC } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { ItemStatus } from "../types/item";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ItemStatus | "all";
  onStatusChange: (value: ItemStatus | "all") => void;
  limit: number;
  onLimitChange: (value: number) => void;
  onCreate: () => void;
  isLoading: boolean;
}

const statusOptions: { label: string; value: ItemStatus | "all" }[] = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Archived", value: "archived" },
];

const pageSizes = [5, 10, 20, 50];

export const SearchBar: FC<SearchBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  limit,
  onLimitChange,
  onCreate,
  isLoading,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={isSmallScreen ? "column" : "row"}
        spacing={2}
        alignItems={isSmallScreen ? "stretch" : "center"}
      >
        <Stack
          direction={isSmallScreen ? "column" : "row"}
          spacing={2}
          flex={1}
        >
          <TextField
            fullWidth
            type="search"
            label="Search"
            placeholder="Search title, description, tags..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <TextField
            select
            label="Status"
            fullWidth
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as ItemStatus | "all")
            }
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Items per page"
            fullWidth
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {pageSizes.map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={onCreate}
          disabled={isLoading}
          size="large"
        >
          Add Item
        </Button>
      </Stack>
    </Paper>
  );
};

export default SearchBar;
