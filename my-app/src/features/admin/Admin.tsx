import React, { ChangeEvent, useState } from "react";
import { getUserId } from "../auth/authAPI";
import { createHotel } from "./adminAPI";
import { useForm, Controller } from "react-hook-form";
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
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  adminUploadBtn: {
    marginBottom: theme.spacing(0.85),
  },
}));

const hongKongIslandLocations = [
  "中環",
  "北角",
  "天后",
  "灣仔",
  "銅鑼灣",
  "鰂魚涌",
];

const kowloonLocations = [
  "佐敦",
  "九龍塘",
  "尖沙咀",
  "土瓜灣",
  "油麻地",
  "深水埗",
  "旺角",
  "觀塘",
  "太子",
  "新蒲崗",
];

const newTerritoriesLocations = ["上水", "元朗", "葵涌", "荃灣", "大埔"];

const userID = Number(getUserId());

interface FormState {
  name: string;
  address: string;
  district: string;
  phone: string;
  profile_pic: File;
  description: string;
  total_rooms: number;
  hourly_rate: number;
  google_map_address: string;
  is_deleted: boolean;
  user_id: number;
  gallery_key: File[];
}

const HotelForm = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, control } =
    useForm<FormState>({
      defaultValues: {
        district: "",
      },
    });

  const onSubmit = async (data: FormState) => {
    const formData = new FormData();

    // Append profile_pic and gallery_pics to formData
    if (data.profile_pic) {
      formData.append("profile_pic", data.profile_pic);
    }

    if (data.gallery_key && data.gallery_key.length > 0) {
      data.gallery_key.forEach((file, index) => {
        formData.append(`gallery_key[${index}]`, file);
      });
    }

    // Append the rest of the form data
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "profile_pic" &&
        key !== "gallery_key" &&
        key !== "is_deleted" &&
        key !== "user_id"
      ) {
        formData.append(key, value);
      }
    });

    // Add user_id and is_deleted fields to formData
    formData.append("user_id", userID.toString());
    formData.append("is_deleted", "false");

    const res = await createHotel(formData);
    if (res) {
      Swal.fire({
        title: "酒店加入成功！",
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/hotels");
      }, 2000);
    } else {
      Swal.fire({
        title: "酒店加入失敗！",
        timer: 2000,
      });
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = event.target.files;
    if (files) {
      if (fieldName === "profile_pic") {
        setValue(fieldName, files[0]);
      } else if (fieldName === "gallery_key") {
        setValue(fieldName, Array.from(files));
      }
    }
  };

  const district = watch("district");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" className="createHotelTitle">
          新增酒店
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="酒店名稱" {...register("name")} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="酒店地址" {...register("address")} />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="district">選擇地區</InputLabel>
            <Select label="District" value={district} {...register("district")}>
              <MenuItem value="">按地區搜尋</MenuItem>
              <MenuItem disabled>香港島</MenuItem>
              {hongKongIslandLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
              <MenuItem disabled>九龍</MenuItem>
              {kowloonLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
              <MenuItem disabled>新界</MenuItem>
              {newTerritoriesLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="電話" {...register("phone")} />
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={(event) => handleFileChange(event, "profile_pic")}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="contained"
              component="span"
              className={classes.adminUploadBtn}
            >
              上傳酒店封面圖片
            </Button>
          </label>
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-gallery"
            type="file"
            multiple
            onChange={(event) => handleFileChange(event, "gallery_pics")}
          />
          <Controller
            name="gallery_key"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <label htmlFor="raised-button-gallery">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.adminUploadBtn}
                >
                  上傳酒店圖庫
                </Button>
              </label>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="描述" {...register("description")} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="房間總數"
            type="number"
            {...register("total_rooms")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="每小時收費"
            type="number"
            {...register("hourly_rate")}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Google地圖位置"
            {...register("google_map_address")}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            提交
          </Button>
        </Grid>
      </Container>
    </form>
  );
};

export default HotelForm;
