import { createSlice } from "@reduxjs/toolkit";
import { fetchProductParts } from "@/store/modules/parts/thunk";
import { PartItem } from "@/types";

interface ProductPartsState {
  parts: PartItem[];
  loading: boolean;
  error: string | null;
  isLoaded: boolean; // Флаг, указывающий, были ли данные загружены
  cachedParts: Record<number, PartItem[]>; // Кэшированные данные по productId
}

const initialState: ProductPartsState = {
  parts: [],
  loading: false,
  error: null,
  isLoaded: false, // Изначально данные не загружены
  cachedParts: {}, // Кэш для частей по productId
};

const productPartsSlice = createSlice({
  name: "productParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
        state.isLoaded = true;

        // Кэшируем данные по productId
        const productId = action.meta.arg; // productId передается как аргумент в thunk
        state.cachedParts[productId] = action.payload;
      })
      .addCase(fetchProductParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productPartsSlice.reducer;
