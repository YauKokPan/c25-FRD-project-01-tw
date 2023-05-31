import React from "react";
import './HotelList.css'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom"
import Title from "./Title";

export default function HotelList() {
  let hotelList = [
    {
      id: 1,
      name: "維多利亞時鐘酒店",
      image: "維多利亞時鐘酒店.jpg",
      address: "旺角砵蘭街194-196號維多利亞大廈4F-23F",
    },
    {
      id: 2,
      name: "金莎酒店",
      image: "金莎酒店.jpg",
      address: "尖沙咀漆咸道南29號溫沙大廈1字樓G及H室",
    },
    {
      id: 3,
      name: "ML28 主題時租時鐘酒店",
      image: "ML28 主題時租時鐘酒店.jpg",
      address: "九龍佐敦德興街9-10號寶來大廈5字樓",
    },
    {
      id: 4,
      name: "青樓 CHILLOUT",
      image: "青樓 CHILLOUT.jpg",
      address: "九龍佐敦彌敦道250號立信大廈5樓F室",
    },
    {
      id: 5,
      name: "上酒店 Up-otel",
      image: "上酒店 Up-otel.jpg",
      address: "香港油麻地東方街4號",
    },
    {
      id: 6,
      name: "百佳酒店 - 灣仔",
      image: "百佳酒店 - 灣仔.jpg",
      address: "灣仔軒尼詩道275-285號立興大廈C舖地下至1F-3F",
    },
  ];

  return (
    <div>
      <Title mainTitle="熱門酒店"/>
        <div>
        <Row>
        {hotelList.map((hotel) => {
        return (
            <Col sm={4} className="hotel-card">
              <Card>
                <Link to={'/hotel-detail/'+hotel.id}>
                <Card.Img variant="top" src={process.env.PUBLIC_URL+'/img/'+hotel.image} className="hotel-img"/>
                </Link>
                
                <Card.Body>
                  <Card.Title>{hotel.name}</Card.Title>
                  <Card.Text>
                  地址 : {hotel.address}
                  </Card.Text>
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

