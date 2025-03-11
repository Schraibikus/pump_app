import { Box, CircularProgress, Typography, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchOrders, deleteOrder } from "@/store/modules/orders/thunk";
import { ActiveOrdersEmpty } from "./ActiveOrdersEmpty";
import { OrderItem } from "@/pages/OrderItem";

export const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);
  // console.log(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Количество заказов на странице
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        console.log("Заказ успешно удалён");
        toast.success("Заказ успешно удалён");
        if (openOrderId === orderId) {
          setOpenOrderId(null);
        }
      } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        toast.error("Ошибка при удалении заказа");
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography>Загрузка заказов...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 4,
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {currentOrders && currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <OrderItem
              key={order.id || order.createdAt}
              orderId={order.id}
              handleDeleteOrder={handleDeleteOrder}
            />
          ))
        ) : (
          <ActiveOrdersEmpty />
        )}
      </Box>
      {orders && orders.length > ordersPerPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            bottom: 50,
            py: 2,
          }}
        >
          <Pagination
            count={Math.ceil(orders.length / ordersPerPage)}
            color="primary"
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            sx={{ my: 2, pl: 4 }}
          />
        </Box>
      )}
    </Box>
  );
};
