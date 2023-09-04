import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box } from "@mui/material";
import "./Footer.css";

export default function Footer() {
  return (
    <Box
      component="footer"
      className="footer-container"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <b>注意：此網站僅作示範用途，並無實際提供預訂服務。</b>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              關於我們
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sweethour是一個搜尋時鐘酒店的平台，讓用戶可以方便地找到最適合自己的時鐘酒店。我們提供了豐富的時鐘酒店資訊，包括房間照片、設施、評分和評論等，讓用戶可以更好地了解酒店的情況。此外，我們的平台還支持線上預訂和付款，讓用戶可以輕鬆安排旅程。Sweethour致力於為所有喜歡時鐘酒店的人提供最好的服務和體驗。
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              聯絡我們
            </Typography>
            <Typography variant="body2" color="text.secondary">
              20B, TML Tower, 3 Hoi Shing Rd, Tsuen Wan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: sweethour@gmail.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +852 9725 6400
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              關注我們
            </Typography>

            <Link
              href="https://www.facebook.com/tecky.io/?locale=zh_HK"
              color="inherit"
            >
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/tecky.io/"
              color="inherit"
              sx={{ pl: 1, pr: 1 }}
            >
              <Instagram />
            </Link>
            <Link href="https://twitter.com/tecky_io" color="inherit">
              <Twitter />
            </Link>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            <img
              src={process.env.PUBLIC_URL + "/img/logo.png"}
              alt="Company Logo"
            />
            {"©  "}
            {new Date().getFullYear()}{" "}
            <Link underline="none" color="inherit" href="https://sweethour.me/">
              {/* https://sweethour.com/ */}
              SweetHour
            </Link>
            {/* {"."} */}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
