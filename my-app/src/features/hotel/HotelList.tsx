import React, { useEffect, useMemo, useState, useRef } from "react";
import "./HotelList.css";
// import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import Title from "../title/Title";
import {
  Hotel,
  UseHotelInfo,
  editHotelAPI,
  softDeleteHotel,
} from "../hotel/hotelAPI";
import {
  addToFavorites,
  fetchUserFavorites,
  removeFromFavorites,
} from "../favorite/favoriteAPI";

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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { getIsAdmin, getUserId } from "../auth/authAPI";
import { AuthGuard } from "../auth/AuthGuard";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SearchBox from "../searchBox/SearchBox";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../query/client";
import Swal from "sweetalert2";
import Badge from "react-bootstrap/Badge";

export default function HotelList() {
  const hotelsPerPage = 9; // Change this to adjust the number of hotels per page
  const hotelInfo = UseHotelInfo();
  // console.log("hotelInfo", hotelInfo);

  const [sortedHotels, setSortedHotels] = useState(hotelInfo);

  useEffect(() => {
    const sorted = [...hotelInfo].sort((a, b) => a.id - b.id);
    setSortedHotels(sorted);
  }, [hotelInfo]);

  const [activePage, setActivePage] = useState(1);

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

  const [selectedFilter, setSelectedFilter] = useState<string>("");

  function handleFilterChange(event: SelectChangeEvent<string>) {
    setSelectedFilter(event.target.value);
  }

  function sortHotels(a: any, b: any) {
    const parseAverageRating = (hotel: any) => {
      const sumOfRatings = hotel.averageRatingArray.reduce(
        (accumulator: number, currentRatingObj: { rating: number }) =>
          accumulator + currentRatingObj.rating,
        0
      );
      const totalRatings = hotel.averageRatingArray.length;
      const averageRating = sumOfRatings / totalRatings;
      return parseFloat(averageRating as unknown as string);
    };

    const parseOccupancyRate = (hotel: any) =>
      parseFloat(hotel.occupancyRates as unknown as string);

    switch (selectedFilter) {
      case "averageRatingDescend":
        const aAverageRating = parseAverageRating(a);
        const bAverageRating = parseAverageRating(b);

        if (isNaN(aAverageRating) && isNaN(bAverageRating)) {
          return 0;
        }

        if (isNaN(aAverageRating)) {
          return 1;
        }

        if (isNaN(bAverageRating)) {
          return -1;
        }

        return bAverageRating - aAverageRating;
      case "averageRatingAscend":
        const cAverageRating = parseAverageRating(a);
        const dAverageRating = parseAverageRating(b);

        if (isNaN(cAverageRating) && isNaN(dAverageRating)) {
          return 0;
        }

        if (isNaN(cAverageRating)) {
          return 1;
        }

        if (isNaN(dAverageRating)) {
          return -1;
        }

        return cAverageRating - dAverageRating;
      case "totalRatings":
        return b.averageRatingArray.length - a.averageRatingArray.length;
      case "occupancyRateAscend":
        return parseOccupancyRate(a) - parseOccupancyRate(b);
      case "occupancyRateDescend":
        return parseOccupancyRate(b) - parseOccupancyRate(a);
      default:
        return 0;
    }
  }

  const is_auth = AuthGuard();

  const navigate = useNavigate();

  // Calculate the index of the first and last hotel to display on the current page
  const lastIndex = activePage * hotelsPerPage;
  const firstIndex = lastIndex - hotelsPerPage;

  // arrange in ascending hotel id order
  // const sortedHotelInfo = [...hotelInfo].sort((a, b) => a.id - b.id);

  // Slice the hotelInfo array to get the hotels for the current page
  const currentHotels = sortedHotels
    .filter((hotelInfoItem) => hotelInfoItem.is_deleted === false)
    .sort(sortHotels)
    .slice(firstIndex, lastIndex);

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          minWidth: 200,
        }}
      >
        <FormControl fullWidth sx={{ width: "50%" }} variant="outlined">
          <InputLabel htmlFor="filter">排序方式</InputLabel>
          <Select
            value={selectedFilter}
            onChange={handleFilterChange}
            label="排序方式"
            inputProps={{
              id: "filter",
            }}
          >
            <MenuItem value="">
              <em>預設</em>
            </MenuItem>
            <MenuItem value="averageRatingDescend">
              平均客戶評分（高至低）
            </MenuItem>
            <MenuItem value="averageRatingAscend">
              平均客戶評分（低至高）
            </MenuItem>
            <MenuItem value="totalRatings">評價數量（高至低）</MenuItem>
            <MenuItem value="occupancyRateAscend">入住率（低至高）</MenuItem>
            <MenuItem value="occupancyRateDescend">入住率（高至低）</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <SearchBox />
      <div className="hotel-row">
        {currentHotels.sort(sortHotels).map((hotel) => {
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
                      <Badge bg="secondary">{totalRatings}則評價</Badge>
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
      <nav>
        <ul className="pagination">
          <li className={`page-item ${activePage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={handlePrevClick}
              disabled={activePage === 1}
            >
              上一頁
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
              下一頁
            </button>
          </li>
        </ul>
      </nav>
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
