import type { FC } from "react";
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
}) => (
  <section className="toolbar">
    <div className="toolbar__filters">
      <input
        type="search"
        placeholder="Search title, description, tags..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as ItemStatus | "all")
        }
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select
        value={limit}
        onChange={(event) => onLimitChange(Number(event.target.value))}
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
    <button
      className="primary"
      type="button"
      onClick={onCreate}
      disabled={isLoading}
    >
      + Add Item
    </button>
  </section>
);

export default SearchBar;
