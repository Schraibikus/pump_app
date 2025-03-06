import { createAsyncThunk } from "@reduxjs/toolkit";
import { PartItem } from "@/types";
import { AxiosError } from "axios";
import { fetchProductPartsApi } from "@/store/modules/parts/apis";

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

    // Если данные уже загружены и есть в кэше, возвращаем их
    if (state.productParts.cachedParts[productId]) {
      return state.productParts.cachedParts[productId];
    }

    try {
      const data = await fetchProductPartsApi(productId);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);
