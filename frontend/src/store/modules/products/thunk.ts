import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { fetchProductsApi } from "@/store/modules/products/apis";
import { Product } from "@/types";

// Асинхронный чанк для получения списка продуктов
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { getState, rejectWithValue }) => {
  const state = getState() as { products: { isLoaded: boolean } };

  // Если данные уже загружены, не выполняем запрос
  if (state.products.isLoaded) {
    return rejectWithValue("Данные уже загружены");
  }

  try {
    return await fetchProductsApi(); // Возвращаем данные
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Ошибка сервера");
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});
