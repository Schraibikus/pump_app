import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        px: 2,
        pb: 1,
        position: "fixed",
        bottom: 0,
        zIndex: 50,
        backgroundImage: "url(/png/tile_background_4.png)",
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "gray" }}>
        Copyright 2025
      </Typography>{" "}
      <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
        created by @Schraibikus
      </Typography>
    </Box>
  );
};
