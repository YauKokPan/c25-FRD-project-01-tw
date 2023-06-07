import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UseHotelInfo } from "../hotel/hotelAPI";
import { Row, Col, Card } from "react-bootstrap";
import "./SearchPage.css";

interface Hotel {
  gallery_key: any;
  id: number;
  name: string;
  address: string;
  district: string;
  phone: string;
  description: string;
  profile_pic: string;
  user_id: number;
  google_map_address: string;
}

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
      <h1>Search Results for "{searchQuery}"</h1>
      <Row className="search-results">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
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
          ))
        ) : (
          <p>No results found for "{searchQuery}"</p>
        )}
      </Row>
    </div>
  );
}