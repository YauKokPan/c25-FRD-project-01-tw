import React, { useState } from "react";
import "./HotelList.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Title from "../title/Title";
import { UseHotelInfo } from "../hotel/hotelAPI";

export default function HotelList() {
  const hotelsPerPage = 9; // Change this to adjust the number of hotels per page
  const hotelInfo = UseHotelInfo();
  const [activePage, setActivePage] = useState(1);

  // Calculate the index of the first and last hotel to display on the current page
  const lastIndex = activePage * hotelsPerPage;
  const firstIndex = lastIndex - hotelsPerPage;

  // Slice the hotelInfo array to get the hotels for the current page
  const currentHotels = hotelInfo.slice(firstIndex, lastIndex);

  // Calculate the total number of pages based on the number of hotels and hotelsPerPage
  const totalPages = Math.ceil(hotelInfo.length / hotelsPerPage);

  // Generate an array of page numbers to display in the pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setActivePage(pageNumber);
  };

  const handlePrevClick = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextClick = () => {
    if (activePage < totalPages) {
      setActivePage(activePage + 1);
    }
  };

  return (
    <div>
      <Title mainTitle="酒店一覽" />
      <div>
        <Row>
          {currentHotels.map((hotel) => {
            return (
              // Add the key prop to the Col component
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
            );
          })}
        </Row>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${activePage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={handlePrevClick}
                disabled={activePage === 1}
              >
                Previous
              </button>
            </li>
            {pageNumbers.map((pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  activePage === pageNumber ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                activePage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={handleNextClick}
                disabled={activePage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}