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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Fragment, useState, useEffect } from "react";
import { ExportDropdown } from "@/components/ExportDropdown";
import { Order, PartItem, PatchOrderPayload } from "@/types";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { patchOrder } from "@/store/modules/orders/thunk";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useNavigate } from "react-router-dom";
import { products } from "@/constants";

export const OrderItem = ({
  orderId,
  handleDeleteOrder,
}: {
  orderId: number;
  handleDeleteOrder: (orderId: number) => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  // Состояния для выбора productHead и productPath
  const [selectedProductHead, setSelectedProductHead] = useState<number | "">(
    ""
  );
  const [selectedProductPath, setSelectedProductPath] = useState<string>("");

  // Обработчик выбора productHead
  const handleProductHeadChange = (event: SelectChangeEvent<number>) => {
    setSelectedProductHead(event.target.value as number);
    setSelectedProductPath(""); // Сбрасываем выбор productPath при изменении productHead
  };

  // Обработчик выбора productPath
  const handleProductPathChange = (event: SelectChangeEvent<string>) => {
    setSelectedProductPath(event.target.value as string);
  };

  // Обработчик нажатия на кнопку "Добавить деталь"
  const handleAddPartClick = () => {
    if (selectedProductHead && selectedProductPath) {
      navigate(
        `/${selectedProductHead}/${selectedProductPath}?orderId=${orderId}`
      );
    } else {
      alert("Пожалуйста, выберите группу изделий и изделие.");
    }
  };

  useEffect(() => {
    if (order) {
      setEditedParts(order.parts || []);
    }
  }, [order]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setSelectedProductHead("");
    setSelectedProductPath("");
    setIsEditing(false);
    setOpenModal(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const payload: PatchOrderPayload = {
        orderId: order.id,
        changes: {
          addItems: editedParts
            .filter((part) => !part.id) // Новые части без ID
            .map((part) => ({
              partId: part.id,
              parentProductId: part.parentProductId,
              productName: part.productName,
              productDrawing: part.productDrawing || null,
              position: part.position,
              name: part.name,
              description: part.description || "",
              designation: part.designation || "",
              quantity: part.quantity,
              drawing: part.drawing || null,
              comment: part.comment || "",
            })),
          removeItems: order.parts
            .filter(
              (originalPart) =>
                !editedParts.some(
                  (editedPart) => editedPart.id === originalPart.id
                )
            )
            .map((part) => ({ id: part.id })), // Удалённые части
          updateItems: editedParts
            .filter((part) => part.id) // Существующие части с ID
            .map((part) => ({
              id: part.id,
              quantity: part.quantity,
            })),
          updateComments: editedParts
            .filter((part) => part.comment)
            .map((part) => ({
              id: part.id,
              comment: part.comment || "",
            })),
          removeComments: editedParts
            .filter(
              (part) =>
                !part.comment &&
                order.parts.some((p) => p.id === part.id && p.comment)
            )
            .map((part) => ({ id: part.id })),
        },
      };

      await dispatch(patchOrder(payload)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Ошибка при обновлении заказа:", error);
    }
  };

  const handleCancelClick = () => {
    setEditedParts(order.parts || []);
    setSelectedProductHead("");
    setSelectedProductPath("");
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

  const handleDeletePart = (id: number) => {
    setEditedParts((prev) => prev.filter((part) => part.id !== id));
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
            <Typography>
              Заказ № {order.id} создан{" "}
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
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
          {isEditing && (
            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel id="product-head-label">Группа изделий</InputLabel>
                <Select
                  labelId="product-head-label"
                  value={selectedProductHead}
                  onChange={handleProductHeadChange}
                  label="Группа изделий"
                >
                  <MenuItem value="">
                    <em>Выберите группу</em>
                  </MenuItem>
                  {[...new Set(products.map((product) => product.head))].map(
                    (head) => (
                      <MenuItem key={head} value={head}>
                        {head === 1
                          ? "СИН32.02"
                          : head === 2
                            ? "СИН32.00"
                            : head}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="product-path-label">Изделие</InputLabel>
                <Select
                  labelId="product-path-label"
                  value={selectedProductPath}
                  onChange={handleProductPathChange}
                  label="Изделие"
                  disabled={!selectedProductHead} // Блокируем, пока не выбран productHead
                >
                  <MenuItem value="">
                    <em>Выберите изделие</em>
                  </MenuItem>
                  {products
                    .filter((product) => product.head === selectedProductHead)
                    .map((product) => (
                      <MenuItem key={product.path} value={product.path}>
                        {product.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPartClick}
                disabled={!selectedProductHead || !selectedProductPath}
              >
                Добавить деталь
              </Button>
            </Box>
          )}
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
                    {isEditing && (
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Действия
                      </TableCell>
                    )}
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
                        <TableCell
                          colSpan={isEditing ? 5 : 4}
                          sx={{ fontWeight: "bold" }}
                        >
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
                                sx={{ width: 80 }}
                                size="small"
                                onChange={(e) =>
                                  handleQuantityChange(
                                    part.id,
                                    parseInt(e.target.value)
                                  )
                                }
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
                              part.comment || ""
                            )}
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <IconButton
                                color="error"
                                onClick={() => handleDeletePart(part.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
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