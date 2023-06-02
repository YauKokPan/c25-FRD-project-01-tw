import React from "react";
import "./HotelList.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Title from "../title/Title";
import { UseHotelInfo } from "../hotel/hotelAPI";

export default function HotelList() {
  const hotelInfo = UseHotelInfo();

  return (
    <div>
      <Title mainTitle="熱門酒店" />
      <div>
        <Row>
          {hotelInfo.map((hotel) => {
            return (
              // Add the key prop to the Col component
              <Col sm={4} className="hotel-card" key={hotel.id}>
                <Card>
                  <Link to={"/hotel-detail/" + hotel.id}>
                    <Card.Img
                      variant="top"
                      src={hotel.profile_pic}
                      className="hotel-img"
                    />
                  </Link>

                  <Card.Body>
                    <Card.Title>{hotel.name}</Card.Title>
                    <Card.Text>地址 : {hotel.address}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
