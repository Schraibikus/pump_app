import { Box, Link, Typography } from "@mui/material";

export const NotFoundPage = () => {
  return (
    <Box
      sx={{
        mx: "auto",
        display: "flex",
        alignItems: "flex-start",
        gap: 6.5,
        position: "relative",
        maxWidth: 1440,
        width: "90%",
        mb: 12.5,
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 1440,
          mx: "auto",
          boxSizing: "border-box",
          p: 10
        }}
      >
        <Box>
          <Box>
            <Typography sx={{ fontSize: 20, textAlign: "center" }}>
              Страницы по такому адресу нет
            </Typography>

            <Typography sx={{ fontSize: 20, textAlign: "center", mt: 2 }}>
              Перейти <Link href="/">на главную страницу</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
