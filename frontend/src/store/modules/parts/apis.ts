import axios from "axios";
import { api } from "@/store/axios";
import { PartItem } from "@/types";

export const fetchProductPartsApi = async (
  productId: number
): Promise<PartItem[]> => {
  try {
    const { data } = await api.get<PartItem[]>(
      `/api/products/${productId}/parts`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при получении деталей изделия:",
        error.response?.data
      );
    } else {
      console.error("Неизвестная ошибка при запросе деталей:", error);
    }
    throw error;
  }
};

export const fetchProductAllPartsApi = async (): Promise<PartItem[]> => {
  try {
    // Сервер возвращает объект с полем data, содержащим массив деталей
    const { data } = await api.get<{ data: PartItem[] }>("/api/parts");
    return data.data; // Достаем массив из объекта ответа
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при получении деталей изделия:",
        error.response?.data?.error || error.message
      );
      // Можно пробросить более детализированную ошибку
      throw new Error(
        error.response?.data?.error || "Ошибка получения деталей"
      );
    } else {
      console.error("Неизвестная ошибка при запросе деталей:", error);
      throw new Error("Неизвестная ошибка при запросе деталей");
    }
  }
};
