import React from "react";
import { UseHotelInfo } from "../hotel/hotelAPI";
import Title from "../title/Title";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import "./HomePage.css";
import { Link } from "react-router-dom";

export default function HomePage() {
  const hotelInfo = UseHotelInfo();

  return (
    <>
      <div className="background-image search-container">
        <div className="text-container">
          <h1 className="caption-title">一站式時鐘酒店平台</h1>
          <p className="sub-title">隨時、隨地、隨心 預訂您的專屬空間</p>
        </div>
      </div>
      <div className="hot-choice">
        <Title mainTitle="❤️‍🔥熱門之選❤️‍🔥" />

        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 4, md: 8 }}>
          {hotelInfo.slice(140, 146).map((hotel) => (
            <Grid
              item
              key={hotel.id}
              xs={12}
              sm={6}
              md={4}
              lg={4}
              className="popular-hotel-container"
            >
              <Card sx={{ maxWidth: { xs: "100%", sm: 360 } }}>
                <Link to={"/hotel-detail/" + hotel.id}>
                  <CardMedia
                    component="img"
                    alt="popular-hotel"
                    height="220"
                    image={hotel.profile_pic}
                  />
                </Link>
                <CardContent>
                  <Typography
                    className="popular-hotel-center"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {hotel.name}
                  </Typography>
                  <Typography
                    className="popular-hotel-center"
                    variant="body2"
                    color="text.secondary"
                  >
                    地址 : {hotel.address}
                  </Typography>
                </CardContent>
                <CardActions className="popular-hotel-center">
                  <Link to={"/hotel-detail/" + hotel.id}>
                    <Button size="medium">立即預約</Button>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
}
