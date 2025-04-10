// thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductPartsApi,
  fetchProductAllPartsApi,
} from "@/store/modules/parts/apis";
import type { PartItem } from "@/types";

// Для деталей конкретного продукта
export const fetchProductParts = createAsyncThunk<
  PartItem[],
  number,
  { rejectValue: string }
>(
  "products/fetchProductParts",
  async (productId, { getState, rejectWithValue }) => {
    const state = getState() as {
      productParts: { cachedParts: Record<number, PartItem[]> };
    };

    if (state.productParts.cachedParts[productId]) {
      return state.productParts.cachedParts[productId];
    }

    try {
      return await fetchProductPartsApi(productId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }
);

// Для всех деталей
export const fetchAllParts = createAsyncThunk<
  PartItem[],
  void,
  { rejectValue: string }
>("products/fetchAllParts", async (_, { rejectWithValue }) => {
  try {
    return await fetchProductAllPartsApi();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Неизвестная ошибка"
    );
  }
});
