import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { Order, PartItem } from "@/types";
import { timesNewRomanBase64, timesNewRomanBoldBase64 } from "@/fonts/fonts";

export const exportOrderToPdf = (order: Order, fileName: string) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Подключаем шрифт Times New Roman
  doc.addFileToVFS("TimesNewRoman.ttf", timesNewRomanBase64);
  doc.addFont("TimesNewRoman.ttf", "TimesNewRoman", "normal");
  doc.addFileToVFS("TimesNewRomanBold.ttf", timesNewRomanBoldBase64);
  doc.addFont("TimesNewRomanBold.ttf", "TimesNewRomanBold", "bold");
  
  // Заголовок
  doc.setFontSize(16);
  doc.setFont("TimesNewRomanBold", "bold");
  doc.text(`Заказ №${order.id}`, 10, 10);
  
  // Дата
  doc.setFontSize(14);
  doc.setFont("TimesNewRoman", "normal");
  doc.text(
    `Дата создания: ${new Date(order.createdAt).toLocaleString()}`,
    10,
    20
  );

  if (order.parts.length > 0) {
    // **Группировка по productName**
    const groupedParts: Record<string, PartItem[]> = order.parts.reduce(
      (acc: Record<string, PartItem[]>, part) => {
        if (!acc[part.productName]) {
          acc[part.productName] = [];
        }
        acc[part.productName].push(part);
        return acc;
      },
      {}
    );

    // Формируем данные для таблицы (включая заголовки в тело)
    const tableData: string[][] = [];

    Object.entries(groupedParts).forEach(([productName, parts]) => {
      // Добавляем заголовок группы в тело таблицы
      tableData.push([productName, "", "", ""]); // Пустые колонки для единообразия

      // Добавляем детали
      parts.forEach((part) => {
        // Объединяем designation и description в одной ячейке
        const designationAndDescription = part.designation
          ? part.description
            ? `${part.designation} (${part.description})`
            : part.designation
          : part.description || "—";

        tableData.push([
          part.name,
          designationAndDescription,
          String(part.quantity),
          String(part.comment),
        ]);
      });
    });

    autoTable(doc, {
      startY: 30,
      body: [
        [
          {
            content: "Наименование",
            styles: {
              font: "TimesNewRomanBold",
              halign: "center",
            },
          },
          {
            content: "Обозначение",
            styles: {
              font: "TimesNewRomanBold",
              halign: "center",
            },
          },
          {
            content: "Кол-во",
            styles: {
              font: "TimesNewRomanBold",
              halign: "center",
            },
          },
          {
            content: "Комментарий",
            styles: {
              font: "TimesNewRomanBold",
              halign: "center",
            },
          },
        ],
        ...tableData.map((row) =>
          typeof row[0] === "string" && groupedParts[row[0]]
            ? [
                {
                  content: `${row[0]}:`,
                  styles: { fontStyle: "bold", font: "TimesNewRomanBold" },
                }, // productName жирный + двоеточие
                "",
                "",
                "",
              ]
            : row.map((cell) =>
                typeof cell === "string"
                  ? {
                      content: cell,
                      styles: { fontStyle: "normal", font: "TimesNewRoman" },
                    } // Обычный текст (fontWeight 400)
                  : cell
              )
        ),
      ],
      theme: "grid",
      styles: {
        font: "TimesNewRoman",
        fontSize: 12,
        cellPadding: 2,
        valign: "middle",
        textColor: 0,
      },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "left" },
      },
    } as UserOptions);
  } else {
    doc.text("Нет деталей в заказе", 10, 30);
  }

  doc.save(fileName);
};
