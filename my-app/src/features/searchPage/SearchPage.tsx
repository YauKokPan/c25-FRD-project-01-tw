import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UseHotelInfo,
  editHotelAPI,
  softDeleteHotel,
  Hotel,
  getHotelData,
} from "../hotel/hotelAPI";
import { Col, Card, Badge } from "react-bootstrap";
import "./SearchPage.css";
import SearchBox from "../searchBox/SearchBox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../query/client";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import {
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../favorite/favoriteAPI";
import { AuthGuard } from "../auth/AuthGuard";
import {
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import Swal from "sweetalert2";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const allHotels: Hotel[] = UseHotelInfo();

  // const {
  //   data: allHotels,
  //   error,
  //   isLoading,
  // } = useQuery({
  //   queryKey: ["hotelInfo"],
  //   queryFn: getHotelData,
  // });

  // const [sortedHotels, setSortedHotels] = useState(allHotels);

  // useEffect(() => {
  //   const sorted = [...allHotels].sort((a, b) => a.id - b.id);
  //   setSortedHotels(sorted);
  // }, [allHotels]);

  const filteredHotels = useMemo(
    () =>
      [...allHotels]
        .sort((a, b) => a.id - b.id)
        .filter(
          (hotel) =>
            !hotel.is_deleted &&
            searchQuery &&
            (hotel.name.includes(searchQuery) ||
              hotel.district.includes(searchQuery))
        ),
    [searchQuery, allHotels]
  );

  // const filteredHotels = searchQuery
  //   ? sortedHotels.filter(
  //       (hotel) =>
  //         hotel.is_deleted === false &&
  //         (hotel.name.includes(searchQuery) ||
  //           hotel.district.includes(searchQuery))
  //     )
  //   : [];

  const [buttonState, setButtonState] = useState("");
  const [userFavorites, setUserFavorites] = useState<Hotel[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const openEditDialog = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    if (selectedHotel) {
      if (nameInputRef.current) {
        nameInputRef.current.value = selectedHotel.name;
      }
      if (addressInputRef.current) {
        addressInputRef.current.value = selectedHotel.address;
      }
      if (phoneInputRef.current) {
        phoneInputRef.current.value = selectedHotel.phone;
      }
    }
  }, [selectedHotel]);

  const onSoftDeleteHotel = useMutation(
    async (data: { id: number; is_deleted: boolean }) =>
      softDeleteHotel(data.id, data.is_deleted),
    {
      onSuccess: () => queryClient.invalidateQueries(["hotelInfo"]),
    }
  );

  useEffect(() => {
    queryClient.invalidateQueries(["hotelInfo"]);
  }, [onSoftDeleteHotel.isSuccess]);

  const onEditHotel = useMutation(
    async (data: {
      id: number;
      name: string;
      address: string;
      phone: string;
    }) => editHotelAPI(data.id, data.name, data.address, data.phone),
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
            {filteredHotels.map((hotel) => {
              const averageRatingArray = hotel.averageRatingArray;
              const totalRatings = averageRatingArray.length;

              const sumOfRatings = averageRatingArray.reduce(
                (accumulator, currentRatingObj) => {
                  return accumulator + currentRatingObj.rating;
                },
                0
              );

              const averageRating = sumOfRatings / totalRatings;
              const parsedAverageRating = parseFloat(
                averageRating as unknown as string
              );

              const displayedAverageRating = !isNaN(parsedAverageRating)
                ? `${parsedAverageRating.toFixed(1)}/5`
                : null;

              const occupancyRate = parseFloat(
                hotel.occupancyRates as unknown as string
              );
              const displayRate = !isNaN(occupancyRate)
                ? `${occupancyRate.toFixed(1)}`
                : null;

              return (
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
                      <div className="rating-center">
                        <h5>
                          <Badge bg="success">{displayedAverageRating}</Badge>
                        </h5>

                        <h5>
                          <Badge bg="secondary">
                            {hotel.totalRating}則評價
                          </Badge>
                        </h5>
                      </div>

                      <h5>
                        <Badge bg="info">入住率：{displayRate}%</Badge>
                      </h5>
                      <Card.Text>地址 : {hotel.address}</Card.Text>
                      <Card.Text>電話 : {hotel.phone}</Card.Text>

                      {buttonState === "visible" && (
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            aria-label="edit"
                            onClick={() => openEditDialog(hotel)}
                          >
                            <EditRoundedIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              Swal.fire({
                                title: "確認刪除？",
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: "是",
                                denyButtonText: "否",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  onSoftDeleteHotel.mutate({
                                    id: hotel.id,
                                    is_deleted: true,
                                  });
                                  Swal.fire("已刪除");
                                } else if (result.isDenied) {
                                  Swal.fire("已取消");
                                }
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
              );
            })}
          </div>
        </>
      ) : (
        <h3>沒有符合「{searchQuery}」的搜尋結果</h3>
      )}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        aria-labelledby="edit-hotel-dialog-title"
      >
        <DialogTitle id="edit-hotel-dialog-title">更新酒店資料</DialogTitle>
        <DialogContent>
          <DialogContentText>酒店最新資料</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="名稱"
            type="text"
            fullWidth
            variant="standard"
            inputRef={nameInputRef}
            defaultValue={selectedHotel?.name}
          />
          <TextField
            margin="dense"
            id="address"
            label="地址"
            type="text"
            fullWidth
            variant="standard"
            inputRef={addressInputRef}
            defaultValue={selectedHotel?.address}
          />
          <TextField
            margin="dense"
            id="phone"
            label="電話"
            type="text"
            fullWidth
            variant="standard"
            inputRef={phoneInputRef}
            defaultValue={selectedHotel?.phone}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>取消</Button>
          <Button
            onClick={() => {
              onEditHotel.mutate({
                id: selectedHotel!.id,
                name: nameInputRef.current?.value ?? "",
                address: addressInputRef.current?.value ?? "",
                phone: phoneInputRef.current?.value ?? "",
              });
              setEditDialogOpen(false);
            }}
          >
            確認
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
