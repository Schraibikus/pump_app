import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { exportOrderToDoc } from "@/utils/exportOrderToDoc";
import { exportOrderToPdf } from "@/utils/exportOrderToPdf"; // Укажите правильный путь
import { Order } from "@/types";
import { exportOrderToExcel } from "@/utils/exportOrderToExel";

export const ExportDropdown = ({ order }: { order: Order }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleMenuOpen}>
        Экспорт
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            exportOrderToPdf(order, `order_${order.id}.pdf`);
            handleMenuClose();
          }}
        >
          Экспорт в PDF
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportOrderToDoc(order, `order_${order.id}.docx`);
            handleMenuClose();
          }}
        >
          Экспорт в DOC
        </MenuItem>
        <MenuItem
          onClick={() => {
            exportOrderToExcel(order, `order_${order.id}.xlsx`);
            handleMenuClose();
          }}
        >
          Экспорт в Excel
        </MenuItem>
      </Menu>
    </>
  );
};
