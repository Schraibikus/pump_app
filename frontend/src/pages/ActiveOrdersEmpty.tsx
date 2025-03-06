import { Box, Link, Typography } from "@mui/material";

export const ActiveOrdersEmpty = () => {
  return (
    <Box sx={{ width: "90%", maxWidth: 1440, mx: "auto", mt: 20 }}>
      <Box>
        <Box>
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            Здесь будут отображены ваши заказы
          </Typography>

          <Typography sx={{ fontSize: 20, textAlign: "center", mt: 2 }}>
            Для совершения заказа перейдите{" "}
            <Link href="/">на главную страницу</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
