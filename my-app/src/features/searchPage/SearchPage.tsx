import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UseHotelInfo } from "../hotel/hotelAPI";
import { Row, Col, Card } from "react-bootstrap";
import "./SearchPage.css";
import { Hotel } from "../hotel/hotelAPI";
import SearchBox from "../searchBox/SearchBox";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const allHotels: Hotel[] = UseHotelInfo();
  const filteredHotels = searchQuery
    ? allHotels.filter(
        (hotel) =>
          hotel.name.includes(searchQuery) ||
          hotel.district.includes(searchQuery)
      )
    : [];

  return (
    <div>
      <div className="search-box">
      <SearchBox />
      </div>
      <h1>「{searchQuery}」的搜尋結果</h1>
      <Row className="search-results">
        {filteredHotels.length > 0 ? (
          <>
            <h3>共有{filteredHotels.length}筆紀錄</h3>
            {filteredHotels.map((hotel) => (
              <Col md={4} className="hotel-card" key={hotel.id}>
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
                    <Card.Text>電話 : {hotel.phone}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </>
        ) : (
          <h3>沒有符合「{searchQuery}」的搜尋結果</h3>
        )}
      </Row>
      
    </div>
  );
}
