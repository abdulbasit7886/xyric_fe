import { useEffect } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { Item, ItemPayload, ItemStatus } from "../types/item";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(2000, "Description too long").optional(),
  category: z.string().max(100).optional(),
  price: z.number().nonnegative("Price must be positive"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity must be positive"),
  tags: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]),
});

type ItemFormValues = z.infer<typeof formSchema>;

interface ItemFormModalProps {
  open: boolean;
  initialItem?: Item | null;
  onClose: () => void;
  onSubmit: (values: ItemPayload) => Promise<void> | void;
  isSubmitting: boolean;
}

const toTagString = (tags?: string[]): string =>
  tags?.length ? tags.join(", ") : "";

const ItemFormModal: FC<ItemFormModalProps> = ({
  open,
  initialItem,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      quantity: 0,
      tags: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialItem) {
      reset({
        title: initialItem.title ?? "",
        description: initialItem.description ?? "",
        category: initialItem.category ?? "",
        price: initialItem.price ?? 0,
        quantity: initialItem.quantity ?? 0,
        tags: toTagString(initialItem.tags),
        status: initialItem.status ?? "active",
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "",
        price: 0,
        quantity: 0,
        tags: "",
        status: "active",
      });
    }
  }, [initialItem, reset]);

  const submitHandler = handleSubmit(async (values) => {
    const payload: ItemPayload = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      category: values.category?.trim() || undefined,
      price: values.price,
      quantity: values.quantity,
      status: values.status as ItemStatus,
      tags: values.tags
        ? values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : [],
    };

    await onSubmit(payload);

    if (!initialItem) {
      reset({
        title: "",
        description: "",
        category: "",
        price: 0,
        quantity: 0,
        tags: "",
        status: "active",
      });
    }
  });

  const formId = "item-form";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="item-form-title"
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography id="item-form-title" variant="h6">
            {initialItem ? "Edit item" : "Create item"}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Box component="form" id={formId} onSubmit={submitHandler} noValidate>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <TextField
                label="Title"
                fullWidth
                required
                {...register("title")}
                error={Boolean(errors.title)}
                helperText={errors.title?.message}
              />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <TextField
                label="Category"
                fullWidth
                {...register("category")}
                error={Boolean(errors.category)}
                helperText={errors.category?.message}
              />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <TextField
                label="Price"
                type="number"
                inputProps={{ step: 0.01 }}
                fullWidth
                required
                {...register("price", { valueAsNumber: true })}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
              />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                required
                {...register("quantity", { valueAsNumber: true })}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity?.message}
              />
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 16px)" } }}>
              <TextField
                select
                label="Status"
                fullWidth
                required
                defaultValue={initialItem ? initialItem.status : "active"}
                {...register("status")}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: "1 1 100%" }}>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                {...register("description")}
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
              />
            </Box>
            <Box sx={{ flex: "1 1 100%" }}>
              <TextField
                label="Tags (comma separated)"
                fullWidth
                placeholder="e.g. featured, wholesale"
                {...register("tags")}
                error={Boolean(errors.tags)}
                helperText={errors.tags?.message}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            form={formId}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : initialItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ItemFormModal;
