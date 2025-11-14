import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
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

const App = (): JSX.Element => {
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
      <main className="page">
        <header className="page__header">
          <div>
            <p>
              Track inventory items with live search, pagination, and quick
              edits.
            </p>
          </div>
          <button type="button" className="primary" onClick={handleCreateClick}>
            + Add Item
          </button>
        </header>
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
        <Pagination meta={meta} onPageChange={setPage} isLoading={loading} />
      </main>
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
