import React, { ChangeEvent, useState } from "react";
import { getUserId } from "../auth/authAPI";
import { useCreateHotel } from "../hotel/hotelAPI";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Container,
  Typography,
} from "@material-ui/core";

const userID = Number(getUserId());

const HotelForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    address: "",
    district: "",
    phone: "",
    profile_pic: "",
    description: "",
    total_rooms: 0,
    hourly_rate: 0,
    google_map_address: "",
    is_deleted: false,
    is_favorite: false,
    user_id: userID,
  });

  const createHotelMutation = useCreateHotel();

  const handleChange = (e: any) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createHotelMutation.mutateAsync(formState);
      alert("酒店加入成功！");
    } catch (error) {
      console.error(`Error creating hotel: ${error}`);
      alert("酒店加入失敗！");
    }
  };

  // Add a new function to handle file uploads
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({ ...formState, profile_pic: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" className="createHotelTitle">
          新增酒店
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="酒店名稱"
              name="name"
              value={formState.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="酒店地址"
              name="address"
              value={formState.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="地區"
              name="district"
              value={formState.district}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="電話"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                上傳酒店預覽圖片
              </Button>
            </label>
            {formState.profile_pic && (
              <img
                src={formState.profile_pic}
                alt="Preview"
                style={{ width: "80%", marginTop: "1rem" }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="描述"
              name="description"
              value={formState.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="房間總數"
              name="total_rooms"
              type="number"
              value={formState.total_rooms}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="每小時收費"
              name="hourly_rate"
              type="number"
              value={formState.hourly_rate}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Google地圖位置"
              name="google_map_address"
              value={formState.google_map_address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createHotelMutation.isLoading}
            >
              提交
            </Button>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};

export default HotelForm;
