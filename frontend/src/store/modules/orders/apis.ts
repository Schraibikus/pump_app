import axios from "axios";
import { api } from "@/store/axios";
import { Order, PatchOrderPayload } from "@/types";

export const fetchOrdersApi = async (): Promise<Order[]> => {
  try {
    const { data } = await api.get<Order[]>("/api/orders");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при получении списка заказов:",
        error.response?.data
      );
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    } else {
      console.error("Неизвестная ошибка при запросе списка заказов:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};

export const fetchSingleOrderApi = async (orderId: number): Promise<Order> => {
  try {
    const { data } = await api.get<Order>(`/api/orders/${orderId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при получении заказа:", error.response?.data);
    } else {
      console.error("Неизвестная ошибка при запросе заказа:", error);
    }
    throw error;
  }
};

export const createOrdersApi = async (order: Order) => {
  try {
    const { data } = await api.post<Order>("/api/orders", order);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при создании заказа:", error.response?.data);
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    } else {
      console.error("Неизвестная ошибка при создании заказа:", error);
      throw new Error("Неизвестная ошибка");
    }
  }
};

export const patchOrderApi = async (payload: PatchOrderPayload) => {
  try {
    // console.log("Отправляемые данные:", payload);
    const { data } = await api.patch<Order>("/api/orders", payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Ошибка при изменении заказа:", error.response?.data);
      throw {
        message: error.response?.data?.message || "Ошибка запроса",
        status: error.response?.status,
      };
    } else {
      console.error("Неизвестная ошибка при изменении заказа:", error);
      throw { message: "Неизвестная ошибка" };
    }
  }
};

export const deleteOrdersApi = async (orderId: number): Promise<boolean> => {
  try {
    // Выполняем DELETE-запрос
    const response = await api.delete(`/api/orders/${orderId}`);

    // Если статус ответа 204 (No Content) или 200 (OK), считаем удаление успешным
    if (response.status === 204 || response.status === 200) {
      return true; // Успешное удаление
    }

    // Если статус ответа другой, считаем удаление неудачным
    return false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Обработка ошибок Axios
      if (error.response) {
        // Ошибка от сервера (4xx или 5xx)
        console.error("Ошибка при удалении заказа:", {
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        // Ошибка сети (запрос был отправлен, но ответ не получен)
        console.error("Ошибка сети при удалении заказа:", error.request);
      } else {
        // Другие ошибки
        console.error("Ошибка при настройке запроса:", error.message);
      }
    } else {
      // Неизвестная ошибка
      console.error("Неизвестная ошибка при удалении заказа:", error);
    }

    // Возвращаем false, если удаление не удалось
    return false;
  }
};
