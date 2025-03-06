import { Box, Link, Typography } from "@mui/material";

export const OrderDone = () => {
  return (
    <Box
      sx={{ width: "90%", maxWidth: 1440, mx: "auto", mt: 20 }}
    >
      <Box>
        <Box>
          <Typography sx={{ fontSize: 20, textAlign: "center" }}>
            Вы успешно отправили заказ
          </Typography>

          <Typography sx={{ fontSize: 20, textAlign: "center", mt: 2 }}>
            Для просмотра заказов в можете перейти {" "}
            <Link href="/orders">на страницу заказов</Link>
          </Typography>
          <Typography sx={{ fontSize: 20, textAlign: "center", mt: 2 }}>
            Для продолжения оформления{" "} 
            <Link href="/">на главную страницу</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
