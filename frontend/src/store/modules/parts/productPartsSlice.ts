import { createSlice } from "@reduxjs/toolkit";
import { fetchAllParts, fetchProductParts } from "@/store/modules/parts/thunk";
import { PartItem } from "@/types";

interface ProductPartsState {
  parts: PartItem[];
  allParts: PartItem[];
  loading: boolean;
  loadingAll: boolean;
  error: string | null;
  errorAll: string | null;
  isLoaded: boolean; // Флаг, указывающий, были ли данные загружены
  cachedParts: Record<number, PartItem[]>; // Кэшированные данные по productId
}

const initialState: ProductPartsState = {
  parts: [],
  allParts: [],
  loading: false,
  loadingAll: false,
  error: null,
  errorAll: null,
  isLoaded: false,
  cachedParts: {},
};

const productPartsSlice = createSlice({
  name: "productParts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработчики для fetchProductParts
      .addCase(fetchProductParts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductParts.fulfilled, (state, action) => {
        state.loading = false;
        state.parts = action.payload;
        state.isLoaded = true;
        const productId = action.meta.arg;
        state.cachedParts[productId] = action.payload;
      })
      .addCase(fetchProductParts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обработчики для fetchAllParts
      .addCase(fetchAllParts.pending, (state) => {
        state.loadingAll = true;
        state.errorAll = null;
      })
      .addCase(fetchAllParts.fulfilled, (state, action) => {
        state.loadingAll = false;
        state.allParts = action.payload;
      })
      .addCase(fetchAllParts.rejected, (state, action) => {
        state.loadingAll = false;
        state.errorAll = action.payload as string;
      });
  },
});

export default productPartsSlice.reducer;
