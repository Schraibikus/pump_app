import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { Fragment, useState, useEffect } from "react";
import { ExportDropdown } from "@/components/ExportDropdown";
import { Order, PartItem } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { patchOrder } from "@/store/modules/orders/thunk";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";

export const OrderItem = ({
  orderId,
  handleDeleteOrder,
}: {
  orderId: number;
  handleDeleteOrder: (orderId: number) => void;
}) => {
  const dispatch = useAppDispatch();

  const defaultOrder: Order = {
    id: 0,
    createdAt: "",
    parts: [],
  };

  const order: Order = useAppSelector(
    (state) =>
      state.orders.orders.find((order) => order.id === orderId) || defaultOrder
  );

  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedParts, setEditedParts] = useState<PartItem[]>(order.parts || []);

  useEffect(() => {
    if (order) {
      setEditedParts((order ?? {}).parts || []);
    }
  }, [order]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await dispatch(
        patchOrder({
          orderId: order.id,
          changes: {
            updateItems: editedParts.map((part) => ({
              id: part.id,
              quantity: part.quantity,
            })),
            updateComments: editedParts
              .filter((part) => part.comment)
              .map((part) => ({
                id: part.id,
                comment: part.comment || "",
              })),
          },
        })
      ).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedParts(order.parts || []);
    setIsEditing(false);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setEditedParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, quantity } : part))
    );
  };

  const handleCommentChange = (id: number, comment: string) => {
    setEditedParts((prev) =>
      prev.map((part) =>
        part.id === id
          ? { ...part, comment: comment.trim() === "" ? " " : comment }
          : part
      )
    );
  };

  return (
    <Box key={order.id} sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button variant="contained" onClick={handleOpenModal}>
          Заказ № {order.id} создан {new Date(order.createdAt).toLocaleString()}
        </Button>
        <ExportDropdown order={order} />
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteOrder(order.id)}
        >
          Удалить заказ
        </Button>
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            maxHeight: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              overflowY: "auto",
              flexGrow: 1,
              mt: 2,
            }}
          >
            <Typography>Заказ № {order.id}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isEditing ? (
                <>
                  <IconButton color="primary" onClick={handleSaveClick}>
                    <SaveIcon />
                  </IconButton>
                  <IconButton color="error" onClick={handleCancelClick}>
                    <CancelIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton color="primary" onClick={handleEditClick}>
                  <EditIcon />
                </IconButton>
              )}
              <ExportDropdown order={order} />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteOrder(order.id)}
              >
                Удалить заказ
              </Button>
            </Box>
          </Box>
          {editedParts.length > 0 ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Наименование
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Обозначение
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Кол-во</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Комментарий
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(
                    editedParts.reduce(
                      (acc, part) => {
                        if (!acc[part.productName]) acc[part.productName] = [];
                        acc[part.productName].push(part);
                        return acc;
                      },
                      {} as Record<string, typeof editedParts>
                    )
                  ).map(([productName, parts]) => (
                    <Fragment key={productName}>
                      <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                        <TableCell colSpan={4} sx={{ fontWeight: "bold" }}>
                          {productName}:
                        </TableCell>
                      </TableRow>
                      {parts.map((part) => (
                        <TableRow key={part.id}>
                          <TableCell>{part.name}</TableCell>
                          <TableCell>
                            {part.designation && part.description
                              ? `${part.designation} (${part.description})`
                              : part.designation || part.description || "—"}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                type="number"
                                value={part.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    part.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                size="small"
                                sx={{ width: 80 }}
                              />
                            ) : (
                              part.quantity
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                value={part.comment || ""}
                                onChange={(e) =>
                                  handleCommentChange(part.id, e.target.value)
                                }
                                size="small"
                                fullWidth
                              />
                            ) : (
                              part.comment || "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography sx={{ p: 2 }}>Нет деталей в заказе</Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};
