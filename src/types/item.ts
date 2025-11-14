export type ItemStatus = "active" | "inactive" | "archived";

export interface Item {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price: number;
  quantity: number;
  tags: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ItemPayload {
  title: string;
  description?: string;
  category?: string;
  price: number;
  quantity: number;
  tags: string[];
  status: ItemStatus;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedItemsResponse {
  success: boolean;
  data: Item[];
  meta: PaginatedMeta;
}
