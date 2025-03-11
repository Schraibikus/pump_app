import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Order, PatchOrderPayload } from "@/types";
import {
  createOrdersApi,
  deleteOrdersApi,
  fetchOrdersApi,
  fetchSingleOrderApi,
  patchOrderApi,
} from "@/store/modules/orders/apis";

// Асинхронный чанк для получения списка продуктов
export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await fetchOrdersApi(); // Теперь возвращает { orders: Orders[] }
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || "Ошибка сервера");
    }
    return rejectWithValue("Неизвестная ошибка.");
  }
});

export const fetchSingleOrder = createAsyncThunk<Order, number>(
  "orders/fetchSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await fetchSingleOrderApi(orderId);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order: Order, { rejectWithValue }) => {
    try {
      const data = await createOrdersApi(order);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);

export const patchOrder = createAsyncThunk(
  "orders/patchOrder",
  async (payload: PatchOrderPayload, { rejectWithValue }) => {
    try {
      const data = await patchOrderApi(payload);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message);
      }
      return rejectWithValue("Неизвестная ошибка.");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const isDeleted = await deleteOrdersApi(orderId);
      if (!isDeleted) {
        // Если удаление не удалось, возвращаем ошибку
        return rejectWithValue({ message: "Не удалось удалить заказ" });
      }
      return orderId; // Возвращаем ID удалённого заказа
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Возвращаем ошибку с данными от сервера
        return rejectWithValue(error.response?.data);
      }
      // Возвращаем неизвестную ошибку
      return rejectWithValue({ message: "Неизвестная ошибка" });
    }
  }
);
