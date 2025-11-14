import type { FC } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import type { Item } from "../types/item";

interface ItemTableProps {
  items: Item[];
  isLoading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const statusColorMap: Record<Item["status"], "success" | "info" | "warning"> = {
  active: "success",
  inactive: "info",
  archived: "warning",
};

export const ItemTable: FC<ItemTableProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const renderBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8}>
            <Stack alignItems="center" py={5} spacing={2}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                Loading items...
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    if (items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8}>
            <Stack alignItems="center" py={5} spacing={1}>
              <Typography variant="subtitle1">No items found</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting filters or add a new item.
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    return items.map((item) => (
      <TableRow key={item._id} hover>
        <TableCell width="22%">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={600}>
              {item.title}
            </Typography>
            {item.description && (
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            )}
          </Stack>
        </TableCell>
        <TableCell>{item.category || "—"}</TableCell>
        <TableCell>${item.price.toFixed(2)}</TableCell>
        <TableCell>{item.quantity}</TableCell>
        <TableCell>
          <Chip
            label={item.status}
            color={statusColorMap[item.status]}
            size="small"
            sx={{ textTransform: "capitalize" }}
          />
        </TableCell>
        <TableCell>
          {item.tags?.length ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {item.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="text"
              startIcon={<EditRoundedIcon />}
              onClick={() => onEdit(item)}
            >
              Edit
            </Button>
            <Button
              color="error"
              variant="text"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => onDelete(item)}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderBody()}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemTable;
