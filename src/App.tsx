import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Box, Container, Stack, Typography } from "@mui/material";
import { createItem, deleteItem, fetchItems, updateItem } from "./api/items";
import type {
  Item,
  ItemPayload,
  ItemStatus,
  PaginatedMeta,
} from "./types/item";
import SearchBar from "./components/SearchBar";
import ItemTable from "./components/ItemTable";
import Pagination from "./components/Pagination";
import ItemFormModal from "./components/ItemFormModal";
import { useDebounce } from "./hooks/useDebounce";

type StatusFilter = ItemStatus | "all";

const App = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchItems({
        search: debouncedSearch || undefined,
        status: status === "all" ? undefined : status,
        page,
        limit,
      });

      setItems(response.data);
      setMeta(response.meta);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load items";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, page, limit]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const handleCreateClick = (): void => {
    setActiveItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: Item): void => {
    setActiveItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: Item): Promise<void> => {
    const confirmation = window.confirm(`Delete "${item.title}"?`);
    if (!confirmation) return;

    try {
      setLoading(true);
      await deleteItem(item._id);
      toast.success("Item deleted");
      await loadItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values: ItemPayload): Promise<void> => {
    setIsSubmitting(true);
    try {
      if (activeItem) {
        await updateItem(activeItem._id, values);
        toast.success("Item updated");
      } else {
        await createItem(values);
        toast.success("Item created");
      }
      setModalOpen(false);
      setActiveItem(null);
      setPage(1);
      await loadItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Box
        component="main"
        sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Typography variant="h4" fontWeight={600}>
                Inventory dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track inventory items with live search, pagination, and quick
                edits.
              </Typography>
            </Stack>
            <SearchBar
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              status={status}
              onStatusChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              limit={limit}
              onLimitChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
              onCreate={handleCreateClick}
              isLoading={loading}
            />
            <ItemTable
              items={items}
              isLoading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <Pagination
              meta={meta}
              onPageChange={setPage}
              isLoading={loading}
            />
          </Stack>
        </Container>
      </Box>
      <ItemFormModal
        open={modalOpen}
        initialItem={activeItem}
        onClose={() => {
          setModalOpen(false);
          setActiveItem(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
export default App;
