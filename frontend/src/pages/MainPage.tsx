import { Box } from "@mui/material";
import { Link } from "react-router-dom"; // Используем Link из react-router-dom

export const MainPage = () => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", gap: 4, p: 4, mt: 2 }}
    >
      <Link to="/1">
        {" "}
        <img
          src="/png/pump_main_01.png"
          alt="logo"
          style={{ maxWidth: "100%", maxHeight: "100%", cursor: "pointer" }}
        />
      </Link>
    </Box>
  );
};
