import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";

export const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabValue, setTabValue] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  // Обработчик скролла
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 20) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (location.pathname.startsWith("/1")) {
      setTabValue(1);
    } else if (location.pathname.startsWith("/2")) {
      setTabValue(2);
    } else if (location.pathname.startsWith("/3")) {
      setTabValue(3);
    } else {
      switch (location.pathname) {
        case "/":
          setTabValue(0);
          break;
        case "/orders":
          setTabValue(4);
          break;
        default:
          setTabValue(0);
      }
    }
  }, [location.pathname]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/");
        break;
      case 1:
        navigate("/1");
        break;
      case 2:
        navigate("/2");
        break;
      case 3:
        navigate("/3");
        break;
      case 4:
        navigate("/orders");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Box
      sx={{
        pt: 2,
        width: "100%",
        mx: "auto",
        boxSizing: "border-box",
        position: "fixed",
        top: 0,
        height: 70,
        zIndex: 50,
        // backgroundImage: "url(/png/tile_background_4.png)",
        backdropFilter: isHeaderVisible ? "blur(5px)" : "none", // Размытие при скролле
        WebkitBackdropFilter: isHeaderVisible ? "blur(5px)" : "none", // Для Safari
        transition: "backdrop-filter 0.3s ease-in-out",
        ...(isHeaderVisible && {
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "inherit",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
            opacity: 1,
            transition: "opacity 0.3s ease-in-out",
          },
        }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Tabs
          value={tabValue} // Начальное значение
          onChange={handleTabChange}
          aria-label="Tabs for HeaderBar"
          variant="standard"
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: "20px", // Расстояние между табами
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "rgba(0, 0, 255, 0.7)",
            },
          }}
        >
          <Tab label="На главную" />
          <Tab label="СИН32.02" />
          <Tab label="СИН32.00" />
          <Tab label="СИН59.00" />
          <Tab label="Заказы" />
        </Tabs>
        <GlobalSearch />
      </Box>
    </Box>
  );
};
