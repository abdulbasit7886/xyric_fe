import type { FC } from "react";
import type { Item } from "../types/item";

interface ItemTableProps {
  items: Item[];
  isLoading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export const ItemTable: FC<ItemTableProps> = ({
  items,
  isLoading,
  onEdit,
  onDelete,
}) => (
  <div className="table-wrapper">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Status</th>
          <th>Tags</th>
          <th>Updated</th>
          <th aria-label="actions" />
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8} className="empty-state">
              Loading items...
            </td>
          </tr>
        ) : items.length === 0 ? (
          <tr>
            <td colSpan={8} className="empty-state">
              No items found. Try adjusting filters or add a new item.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="cell-stack">
                  <span className="cell-title">{item.title}</span>
                  {item.description && <small>{item.description}</small>}
                </div>
              </td>
              <td>{item.category || "—"}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>
                <span className={`status-chip status-${item.status}`}>
                  {item.status}
                </span>
              </td>
              <td>
                {item.tags?.length ? (
                  <div className="tag-group">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  "—"
                )}
              </td>
              <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
              <td>
                <div className="action-group">
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => onDelete(item)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default ItemTable;
