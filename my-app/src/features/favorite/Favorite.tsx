import React, { useEffect, useMemo, useState } from "react";
import "./Favorite.css";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import { AuthGuard } from "../auth/AuthGuard";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../favorite/favoriteAPI";
import { Hotel } from "../hotel/hotelAPI";

const Favorites: React.FC<{ userID: number }> = ({ userID }) => {
  const [userFavorites, setUserFavorites] = useState<Hotel[]>([]);

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

  const isAdmin = useMemo(() => getIsAdmin(), []); // Memoize the result of getIsAdmin()

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = await fetchUserFavorites(userID);
      setUserFavorites(favorites);
    };

    fetchFavorites();
  }, [userID, isAdmin]); // Use the memoized value in the dependency array

  return (
    <div className="favorites-container">
      <h1 className="favourites-h1">我的最愛</h1>
      {userFavorites === null ? (
        <p>Loading...</p>
      ) : userFavorites.length ? (
        <div className="favourites-row">
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
                            ? "#FF6D75"
                            : "inherit",
                        }}
                      >
                        <FavoriteRoundedIcon />
                      </IconButton>
                    )}
                  </div>
                  <Card.Text>地址 : {hotel.address}</Card.Text>{" "}
                  <Card.Text>電話 : {hotel.phone}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      ) : (
        <h5 className="no-booking">暫無收藏</h5>
      )}
    </div>
  );
};

export default Favorites;
