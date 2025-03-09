import { Box } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom"; // Используем Link из react-router-dom

export const MainPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: 4, p: 4, mt: 2 }}
    >
      <Link to="/1">
        {" "}
        <img
          src="/png/result_02.png"
          alt="logo"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            transform: isHovered ? "scale(1.05)" : "none",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </Link>
    </Box>
  );
};
