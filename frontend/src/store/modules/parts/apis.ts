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
