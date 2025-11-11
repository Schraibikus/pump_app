import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Order, PartItem } from "@/types";

export const exportOrderToExcel = (order: Order, fileName: string) => {
  const header = [
    ["Заказ №", order.id],
    ["Дата создания", new Date(order.createdAt).toLocaleString()],
    [],
  ];

  const tableRows: (string | number)[][] = [
    ["Наименование", "Обозначение", "Кол-во", "Комментарий"],
  ];

  if (order.parts.length > 0) {
    const groupedParts: Record<string, PartItem[]> = order.parts.reduce(
      (acc: Record<string, PartItem[]>, part) => {
        if (!acc[part.productName]) acc[part.productName] = [];
        acc[part.productName].push(part);
        return acc;
      },
      {} as Record<string, PartItem[]>
    );

    Object.entries(groupedParts).forEach(([productName, parts]) => {
      tableRows.push([`${productName}:`, "", "", ""]);
      parts.forEach((part) => {
        const designationAndDescription = part.designation
          ? part.description
            ? `${part.designation} (${part.description})`
            : part.designation
          : part.description || "";
        tableRows.push([
          part.name,
          designationAndDescription,
          part.quantity,
          part.comment || "",
        ]);
      });
    });
  } else {
    tableRows.push(["Нет деталей в заказе", "", "", ""]);
  }

  // Формируем worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([...header, ...tableRows]);

  // Создаем таблицу (structured table) поверх данных
  XLSX.utils.sheet_add_aoa(worksheet, tableRows, { origin: header.length });

  // Установка ширины колонок
  worksheet["!cols"] = [{ wch: 40 }, { wch: 30 }, { wch: 10 }, { wch: 40 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Order");

  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
