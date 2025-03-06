import { useState, useEffect, useCallback } from "react";
import { Button } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Импортируем иконку

const ScrollToTopButton = () => {
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(false);

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 30) {
      setIsBackButtonVisible(true);
    } else {
      setIsBackButtonVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <Button
      variant="contained"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // Плавная прокрутка
      sx={{
        position: "fixed",
        right: "3%",
        bottom: "10%",
        zIndex: 50,
        opacity: isBackButtonVisible ? 1 : 0, // Плавное появление
        transition: "opacity 0.3s ease-in-out", // Анимация
        pointerEvents: isBackButtonVisible ? "auto" : "none", // Отключаем клики, когда кнопка не видна
        minWidth: "auto", // Убираем лишние отступы
        p: 2.5, // Уменьшаем padding
      }}
    >
      <ArrowUpwardIcon /> {/* Иконка стрелки вверх */}
    </Button>
  );
};

export default ScrollToTopButton;