import React, { useEffect, useState } from "react";
import "./Favorite.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import { AuthGuard } from "../auth/AuthGuard";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  Hotel,
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../hotel/hotelAPI";

const Favorites: React.FC<{ userID: number }> = ({ userID }) => {
  const [userFavorites, setUserFavorites] = useState<Hotel[]>([]);

  const [buttonState, setButtonState] = useState("");
  //   const [favorites, setFavorites] = useState<Hotel[]>([]);

  const is_auth = AuthGuard();

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

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = await fetchUserFavorites(userID);
      setUserFavorites(favorites);
    };

    fetchFavorites();

    const updateButtonState = () => {
      const isAdmin = getIsAdmin();

      if (isAdmin) {
        setButtonState("visible");
      } else {
        setButtonState("hidden");
      }
    };
    updateButtonState();
  }, [userID, getIsAdmin()]);

  return (
    <div className="favorites-container">
      <h1 className="favourites-h1">我的收藏</h1>
      {userFavorites === null ? (
        <p>Loading...</p>
      ) : userFavorites.length ? (
        <Row>
          {userFavorites.map((hotel: any) => (
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
          ))}
        </Row>
      ) : (
        <h5 className="no-booking">暫無收藏</h5>
      )}
    </div>
  );
};

export default Favorites;
