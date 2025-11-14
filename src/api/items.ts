import api from "./client";
import type { Item, ItemPayload, PaginatedItemsResponse } from "../types/item";

export interface ListParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const fetchItems = async (
  params: ListParams
): Promise<PaginatedItemsResponse> => {
  const { data } = await api.get<PaginatedItemsResponse>("/items", { params });
  return data;
};

export const createItem = async (payload: ItemPayload): Promise<Item> => {
  const { data } = await api.post<{ success: boolean; data: Item }>(
    "/items",
    payload
  );
  return data.data;
};

export const updateItem = async (
  id: string,
  payload: Partial<ItemPayload>
): Promise<Item> => {
  const { data } = await api.put<{ success: boolean; data: Item }>(
    `/items/${id}`,
    payload
  );
  return data.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/items/${id}`);
};
