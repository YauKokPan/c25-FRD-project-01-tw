import React, { useEffect, useMemo, useState } from "react";
import "./HotelList.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import Title from "../title/Title";
import { Hotel, UseHotelInfo } from "../hotel/hotelAPI";
import {
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../favorite/favoriteAPI";

import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import { AuthGuard } from "../auth/AuthGuard";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SearchBox from "../searchBox/SearchBox";

export default function HotelList() {
  const hotelsPerPage = 9; // Change this to adjust the number of hotels per page
  const hotelInfo = UseHotelInfo();
  // console.log("hotelInfo", hotelInfo);
  const [activePage, setActivePage] = useState(1);

  const [buttonState, setButtonState] = useState("");

  const [userFavorites, setUserFavorites] = useState<Hotel[]>([]);

  // const [favorites, setFavorites] = useState<Hotel[]>([]);

  const toggleFavorite = async (hotel: Hotel) => {
    const isCurrentlyFavorite = userFavorites.some(
      (fav: any) => fav.id === hotel.id
    );
    const userId = Number(getUserId()); // Get the user ID from the authenticated user

    if (isCurrentlyFavorite) {
      await removeFromFavorites(hotel.id, userId); // Use the new function to remove the hotel from favorites
      setUserFavorites(userFavorites.filter((fav: any) => fav.id !== hotel.id)); // Update the userFavorites state
    } else {
      await addToFavorites(hotel.id, true, userId);
      setUserFavorites([...userFavorites, hotel]);
    }
  };

  const is_auth = AuthGuard();

  const navigate = useNavigate();

  // Calculate the index of the first and last hotel to display on the current page
  const lastIndex = activePage * hotelsPerPage;
  const firstIndex = lastIndex - hotelsPerPage;

  // arrange in ascending hotel id order
  // const sortedHotelInfo = [...hotelInfo].sort((a, b) => a.id - b.id);

  // Slice the hotelInfo array to get the hotels for the current page
  const currentHotels = hotelInfo.slice(firstIndex, lastIndex);

  // Calculate the total number of pages based on the number of hotels and hotelsPerPage
  const totalPages = Math.ceil(hotelInfo.length / hotelsPerPage);

  // Generate an array of page numbers to display in the pagination controls
  const pageNumbers = [];
  const maxPageNumbers = 5; // Change this to adjust the maximum number of page numbers to display
  const middlePageNumber = Math.ceil(maxPageNumbers / 2);
  let startPageNumber = activePage - middlePageNumber + 1;
  if (startPageNumber < 1) {
    startPageNumber = 1;
  }
  let endPageNumber = startPageNumber + maxPageNumbers - 1;
  if (endPageNumber > totalPages) {
    endPageNumber = totalPages;
    startPageNumber = endPageNumber - maxPageNumbers + 1;
    if (startPageNumber < 1) {
      startPageNumber = 1;
    }
  }
  for (let i = startPageNumber; i <= endPageNumber; i++) {
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

  const userID = Number(getUserId());

  const isAdmin = useMemo(() => getIsAdmin(), []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userID) {
        return; // If there's no userID, return without fetching favorites
      }
      const favorites = await fetchUserFavorites(userID);
      setUserFavorites(favorites);
    };

    fetchFavorites();

    const updateButtonState = () => {
      if (isAdmin) {
        setButtonState("visible");
      } else {
        setButtonState("hidden");
      }
    };
    updateButtonState();
  }, [userID, isAdmin]);

  return (
    <>
      <div className="hotel-list-container">
        <div className="title-container">
          <Title mainTitle="酒店一覽🏩" />
          {buttonState === "visible" && (
            <IconButton
              aria-label="add"
              size="large"
              onClick={() => navigate("/admin")}
            >
              <AddCircleRoundedIcon fontSize="inherit" />
            </IconButton>
          )}
        </div>
        <SearchBox />
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
                    <div className="fav-container">
                      <Card.Title>{hotel.name}</Card.Title>
                      {is_auth && (
                        <IconButton
                          aria-label="fav"
                          onClick={() => toggleFavorite(hotel)}
                          style={{
                            color: userFavorites.some(
                              (fav) => fav.id === hotel.id
                            )
                              ? "red"
                              : "inherit",
                          }}
                        >
                          <FavoriteRoundedIcon />
                        </IconButton>
                      )}
                    </div>
                    <Card.Text>地址 : {hotel.address}</Card.Text>{" "}
                    <Card.Text>電話 : {hotel.phone}</Card.Text>
                    {buttonState === "visible" && (
                      <Stack direction="row" spacing={1}>
                        <IconButton aria-label="edit">
                          <EditRoundedIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    )}
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
    </>
  );
}
