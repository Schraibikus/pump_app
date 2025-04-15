import { useState, useMemo } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useReduxHooks";
import { PartItem, Product } from "@/types";

type EnrichedPartItem = PartItem & {
  productName: string;
  productDrawing?: number | null;
  productHead?: number;
  productPath?: string;
};

export const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // Получаем данные из Redux
  const { products } = useAppSelector((state) => state.products);
  const { allParts } = useAppSelector((state) => state.productParts);

  // Создаем карту продуктов для быстрого доступа
  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  // Обогащаем части информацией о продукте
  const enrichedParts = useMemo(() => {
    return allParts.map((part) => {
      const product = productMap.get(part.productId);
      return {
        ...part,
        productName: product?.name || "Неизвестное изделие",
        productDrawing: product?.drawing,
        productHead: product?.head,
        productPath: product?.path,
      };
    });
  }, [allParts, productMap]);

  // Функция поиска
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { products: [], parts: [] };

    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(Boolean);

    const searchInText = (text: string) => {
      return queryWords.every((word) => text.toLowerCase().includes(word));
    };

    // Поиск по изделиям
    const productResults = products.filter((product) => {
      const searchString = [
        product.name,
        product.drawing?.toString(),
        // product.head?.toString(),
      ]
        .join(" ")
        .toLowerCase();
      return searchInText(searchString);
    });

    // Поиск по деталям
    const partResults = enrichedParts.filter((part) => {
      const searchString = [
        part.name,
        part.designation || "",
        part.position?.toString() || "",
        part.description || "",
      ]
        .join(" ")
        .toLowerCase();
      return searchInText(searchString);
    });

    return {
      products: productResults,
      parts: partResults,
    };
  }, [searchQuery, products, enrichedParts]);


  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleItemClick = (item: Product | EnrichedPartItem) => {
    setSearchQuery("");
    setIsFocused(false);

    if ("head" in item) {
      // Навигация для изделия
      navigate(`/${item.head}${item.path}`);
    } else {
      // Навигация для детали
      navigate(`/${item.productHead}${item.productPath}#pos-${item.position}`);
    }
  };

  // Функция для подсветки совпадений
  const highlightMatch = (text: string = "", query: string) => {
    if (!text || !query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, "gi");
    return text
      .toString()
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={i}
            style={{ backgroundColor: "#ffeb3b", padding: "0 2px" }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
  };

  const hasResults =
    searchResults.products.length > 0 || searchResults.parts.length > 0;

  return (
    <Box sx={{ position: "relative", width: 500, maxWidth: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск по изделиям и деталям..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={handleClearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {isFocused && searchQuery && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 1,
            mt: 1,
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          {hasResults ? (
            <>
              {searchResults.products.length > 0 && (
                <>
                  <Typography
                    variant="subtitle2"
                    sx={{ p: 1, fontWeight: 600 }}
                  >
                    Изделия ({searchResults.products.length})
                  </Typography>
                  <List dense>
                    {searchResults.products.map((product) => (
                      <ListItem
                        key={`product-${product.id}`}
                        role="button"
                        onClick={() => handleItemClick(product)}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgb(7, 154, 213, 0.1)",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <>
                              {highlightMatch(product.name, searchQuery)}
                              <Typography
                                component="span"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                (рис.
                                {highlightMatch(
                                  product.drawing?.toString(),
                                  searchQuery
                                )}
                                )
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {searchResults.parts.length > 0 && (
                <>
                  <Divider />
                  <Typography
                    variant="subtitle2"
                    sx={{ p: 1, fontWeight: 600 }}
                  >
                    Детали ({searchResults.parts.length})
                  </Typography>
                  <List dense>
                    {searchResults.parts.map((part) => (
                      <ListItem
                        key={`part-${part.id}-${part.position}`}
                        role="button"
                        onClick={() => handleItemClick(part)}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgb(55, 105, 43, 0.1)",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <>
                              {highlightMatch(part.name, searchQuery)}
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1 }}
                              >
                                (изделие: {part.productName})
                              </Typography>
                            </>
                          }
                          secondary={
                            <>
                              {part.position && (
                                <Typography component="div">
                                  Позиция:{" "}
                                  {highlightMatch(
                                    part.position.toString(),
                                    searchQuery
                                  )}
                                </Typography>
                              )}
                              {part.description && (
                                <Typography component="div">
                                  Описание:{" "}
                                  {highlightMatch(
                                    part.description,
                                    searchQuery
                                  )}
                                </Typography>
                              )}
                              {part.designation && (
                                <Typography component="div">
                                  Обозначение:{" "}
                                  {highlightMatch(
                                    part.designation,
                                    searchQuery
                                  )}
                                </Typography>
                              )}
                              {part.quantity && (
                                <Typography component="div">
                                  Количество:{" "}
                                  {highlightMatch(
                                    part.quantity.toString(),
                                    searchQuery
                                  )}
                                </Typography>
                              )}
                              {part.drawing && (
                                <Typography component="div">
                                  Рисунок:{" "}
                                  {highlightMatch(
                                    part.drawing.toString(),
                                    searchQuery
                                  )}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          ) : (
            <Typography variant="body2" sx={{ p: 2, color: "text.secondary" }}>
              Ничего не найдено
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
