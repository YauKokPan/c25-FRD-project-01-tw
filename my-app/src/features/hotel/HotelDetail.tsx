import React from "react";
import { useParams } from "react-router-dom";
import Title from "../title/Title";
import { useHotelDetail } from "./hotelAPI";
import Equipment from "../equipment/Equipment";
import "./HotelList.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import Gallery from "../gallery/Gallery";
import { Container, Col, Row } from "react-bootstrap";
import RatingForm from "../rating/RatingForm";
import BookingSlot from "../bookings/Bookings";

export default function HotelDetail() {
  let { hotelId } = useParams();
  const hotelIdNum = Number(hotelId);

  // Find the specific hotel using the hotelId
  const { isLoading, error, data: hotel } = useHotelDetail(hotelIdNum);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load hotel details: {String(error)}</div>;
  }

  return (
    <div className="content-container">
      <Title mainTitle="酒店資料🏨" />
      <Gallery hotel={hotel} />
      <Container>
        <Row>
          <Col xs={12} lg={6}>
            <h2>{hotel.name}💖</h2>
            <p>地址: {hotel.address}</p>
            <p>地區: {hotel.district}</p>
            <p>電話: {hotel.phone}</p>
            <p>描述: {hotel.description}</p>
          </Col>
          <Col xs={12} lg={6}>
            <Equipment />
          </Col>
          <Col xs={12} lg={6}>
            <h2>酒店地圖🗺️</h2>
            <div className="map-container">
              <div
                className="map"
                dangerouslySetInnerHTML={{ __html: hotel.google_map_address }}
              />
            </div>
            <h2 className="rating">發表評論👍</h2>
            <RatingForm hotel={hotel} />
          </Col>
          <Col xs={12} lg={6}>
            <h2>酒店預約😉</h2>
            <BookingSlot hotel={hotel} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
