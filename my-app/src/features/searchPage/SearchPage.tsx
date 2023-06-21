import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UseHotelInfo, softDeleteHotel } from "../hotel/hotelAPI";
import { Row, Col, Card } from "react-bootstrap";
import "./SearchPage.css";
import { Hotel } from "../hotel/hotelAPI";
import SearchBox from "../searchBox/SearchBox";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../query/client";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import {
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../favorite/favoriteAPI";
import { AuthGuard } from "../auth/AuthGuard";
import { IconButton, Stack } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const allHotels: Hotel[] = UseHotelInfo();
  const filteredHotels = searchQuery
    ? allHotels.filter(
        (hotel) =>
          (hotel.is_deleted === false && hotel.name.includes(searchQuery)) ||
          hotel.district.includes(searchQuery)
      )
    : [];

  const [buttonState, setButtonState] = useState("");
  const [userFavorites, setUserFavorites] = useState<Hotel[]>([]);
  const onSoftDeleteHotel = useMutation(
    async (data: { id: number; is_deleted: boolean }) =>
      softDeleteHotel(data.id, data.is_deleted),
    {
      onSuccess: () => queryClient.invalidateQueries(["hotelInfo"]),
    }
  );

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
    <div>
      <div className="search-box">
        <SearchBox />
      </div>
      <h1>「{searchQuery}」的搜尋結果</h1>

      {filteredHotels.length > 0 ? (
        <>
          <h3>共有{filteredHotels.length}筆紀錄</h3>
          <div className="search-results">
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
                    <Card.Text>地址 : {hotel.address}</Card.Text>
                    <Card.Text>電話 : {hotel.phone}</Card.Text>
                    {buttonState === "visible" && (
                      <Stack direction="row" spacing={1}>
                        <IconButton aria-label="edit">
                          <EditRoundedIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            onSoftDeleteHotel.mutate({
                              id: hotel.id,
                              is_deleted: true,
                            });
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </div>
        </>
      ) : (
        <h3>沒有符合「{searchQuery}」的搜尋結果</h3>
      )}
    </div>
  );
}
