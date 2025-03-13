import { mainPageProducts } from "@/constants";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export const MainPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        justifyContent: "center",
        p: 4,
        mt: 2,
      }}
    >
      {mainPageProducts.map((product, index) => (
        <Link
          key={product.head}
          to={product.head}
          style={{
            textDecoration: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              transition: "transform 0.3s ease-in-out",
              transform: hoveredIndex === index ? "scale(1.05)" : "scale(1)",
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={product.path}
              alt="logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                cursor: "pointer",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: 24,
              textAlign: "center",
              mt: 2,
            }}
          >
            {product.name}
          </Typography>
        </Link>
      ))}
    </Box>
  );
};
