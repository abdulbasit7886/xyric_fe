import { useEffect } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  } = useForm<ItemFormValues, undefined, ItemFormValues>({
    resolver: zodResolver<ItemFormValues, undefined, ItemFormValues>(
      formSchema
    ),
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
        title: initialItem.title,
        description: initialItem.description ?? "",
        category: initialItem.category ?? "",
        price: initialItem.price,
        quantity: initialItem.quantity,
        tags: toTagString(initialItem.tags),
        status: initialItem.status,
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
  });

  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal__header">
          <h2>{initialItem ? "Edit item" : "Create item"}</h2>
          <button type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        <form className="modal__content" onSubmit={submitHandler}>
          <div className="form-grid">
            <label>
              <span>Title *</span>
              <input type="text" {...register("title")} />
              {errors.title && (
                <small className="error">{errors.title.message}</small>
              )}
            </label>
            <label>
              <span>Category</span>
              <input type="text" {...register("category")} />
              {errors.category && (
                <small className="error">{errors.category.message}</small>
              )}
            </label>
            <label>
              <span>Price *</span>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <small className="error">{errors.price.message}</small>
              )}
            </label>
            <label>
              <span>Quantity *</span>
              <input
                type="number"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <small className="error">{errors.quantity.message}</small>
              )}
            </label>
            <label>
              <span>Status *</span>
              <select {...register("status")}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <label className="full-row">
              <span>Description</span>
              <textarea rows={3} {...register("description")} />
              {errors.description && (
                <small className="error">{errors.description.message}</small>
              )}
            </label>
            <label className="full-row">
              <span>Tags (comma separated)</span>
              <input type="text" {...register("tags")} />
              {errors.tags && (
                <small className="error">{errors.tags.message}</small>
              )}
            </label>
          </div>
          <footer className="modal__footer">
            <button
              type="button"
              className="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialItem ? "Update" : "Create"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ItemFormModal;
