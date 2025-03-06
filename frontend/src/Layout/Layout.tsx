import { Outlet } from "react-router-dom";
import { HeaderBar } from "@/components/HeaderBar";
import { Footer } from "@/components/Footer";
import { Box } from "@mui/material";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderBar />
      <Box sx={{ flex: 1, py: 8 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
