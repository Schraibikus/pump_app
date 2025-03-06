import { Order, PartItem } from "@/types";
import {
  Packer,
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

export const exportOrderToDoc = (order: Order, fileName: string) => {
  const docContent = [];

  // Заголовок
  docContent.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Заказ №${order.id}`,
          bold: true,
          size: 28, // Размер шрифта для заголовка
        }),
      ],
      alignment: "center",
    })
  );

  // Дата создания
  docContent.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Дата создания: ${new Date(order.createdAt).toLocaleString()}`,
          size: 22, // Размер шрифта для даты
        }),
      ],
      alignment: "left",
    })
  );

  // Если есть детали заказа
  if (order.parts.length > 0) {
    // Группировка по productName
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

    // Создаем таблицу
    const tableRows: TableRow[] = [];

    // Заголовок таблицы
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Наименование",
                    bold: true,
                  }),
                ],
                alignment: "center",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Обозначение",
                    bold: true,
                  }),
                ],
                alignment: "center",
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Кол-во",
                    bold: true,
                  }),
                ],
                alignment: "center",
              }),
            ],
          }),
        ],
      })
    );

    // Добавляем данные в таблицу
    Object.entries(groupedParts).forEach(([productName, parts]) => {
      // Заголовок группы (только в первом столбце)
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${productName}:`,
                      bold: true,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "", // Пустой второй столбец
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "", // Пустой третий столбец
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );

      // Детали группы
      parts.forEach((part) => {
        // Объединяем designation и description в одной ячейке
        const designationAndDescription = part.designation
          ? part.description
            ? `${part.designation} (${part.description})`
            : part.designation
          : part.description || "—";
        tableRows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: part.name,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: designationAndDescription,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: String(part.quantity),
                      }),
                    ],
                    alignment: "center",
                  }),
                ],
              }),
            ],
          })
        );
      });
    });

    // Добавляем таблицу в документ
    docContent.push(
      new Table({
        rows: tableRows,
        width: {
          size: 100, // Ширина таблицы в процентах (100% от ширины страницы)
          type: WidthType.PERCENTAGE,
        },
        columnWidths: [4000, 3000, 1500], // Ширина столбцов в TWIP (1 см = 567 TWIP)
      })
    );
  } else {
    // Если нет деталей в заказе
    docContent.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Нет деталей в заказе",
          }),
        ],
      })
    );
  }

  // Создаем документ
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docContent,
      },
    ],
  });

  // Сохраняем документ
  Packer.toBlob(doc).then((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  });
};
