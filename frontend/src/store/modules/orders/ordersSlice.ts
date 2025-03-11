import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, PartItem } from "@/types";
import {
  createOrder,
  deleteOrder,
  fetchOrders,
  fetchSingleOrder,
  patchOrder,
} from "@/store/modules/orders/thunk";

interface OrdersState {
  orders: Order[] | [];
  singleOrder: Order | null;
  parts: PartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  parts: [],
  singleOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addPartToOrder: (state, action: PayloadAction<PartItem>) => {
      const existingPart = state.parts.find(
        (part) =>
          part.id === action.payload.id &&
          part.selectedSet === action.payload.selectedSet
      );

      if (existingPart) {
        // Если часть уже есть в заказе, увеличиваем её количество
        existingPart.quantity += action.payload.quantity;
      } else {
        // Если части нет, добавляем новую запись
        state.parts.push(action.payload);
      }
    },
    removePartFromOrder: (state, action: PayloadAction<number>) => {
      state.parts = state.parts.filter((part) => part.id !== action.payload);
    },
    clearOrder: (state) => {
      state.parts = [];
    },
  },
  extraReducers: (builder) => {
    //создание заказа
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = [...state.orders, action.payload];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка создания заказа";
      });

    //получение списка заказов
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказов";
      });

    //получение одного заказа
    builder
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSingleOrder.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.singleOrder = action.payload;
        }
      )
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Ошибка загрузки данных заказа";
      });

    //изменение заказа
    builder
      .addCase(patchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchOrder.fulfilled, (state, action) => {
        state.loading = false;

        const updatedOrder = action.payload;

        // Обновляем singleOrder
        if (state.singleOrder?.id === updatedOrder.id) {
          state.singleOrder = updatedOrder;
        }

        // Обновляем список заказов
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
        // if (state.singleOrder) {
        //   if (state.singleOrder && state.singleOrder.id === action.payload.id) {
        //     state.singleOrder = action.payload; // Обновляем singleOrder
        //   }
        // }
      })
      .addCase(patchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка изменения заказа";
      });

    // Удаление заказа
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          // Удаляем заказ из списка
          state.orders = state.orders.filter(
            (order) => order.id !== action.payload
          );
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка удаления заказа";
      });
  },
});

export const { addPartToOrder, removePartFromOrder, clearOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
