import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types"; 
import { fetchProducts } from "@/store/modules/products/thunk";

interface ProductsState {
  products: Product[] | [];
  loading: boolean;
  error: string | null;
  isLoaded: boolean; // Флаг, указывающий, были ли данные загружены
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  isLoaded: false, // Изначально данные не загружены
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
          state.isLoaded = true; // Устанавливаем флаг, что данные загружены
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки данных";
      });
  },
});

export default productsSlice.reducer;
