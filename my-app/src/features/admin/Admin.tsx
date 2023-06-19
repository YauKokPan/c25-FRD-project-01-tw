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
  gallery_pics: File[];
}

const HotelForm = () => {
  const { register, handleSubmit, watch, setValue, control } =
    useForm<FormState>();

  const onSubmit = async (data: FormState) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "profile_pic" && value) {
        formData.append(key, value);
      } else if (key === "gallery_pics") {
        value.forEach((file: any, index: any) => {
          formData.append(`gallery_key[${index}]`, file);
        });
      } else {
        formData.append(key, value);
      }
    });

    const res = await createHotel(formData);
    alert(JSON.stringify(`${res.message}, status: ${res.status}`));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = event.target.files;
    if (files) {
      if (fieldName === "profile_pic") {
        setValue(fieldName, files[0]);
      } else if (fieldName === "gallery_pics") {
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
            {...register("profile_pic")}
            onChange={(event) => handleFileChange(event, "profile_pic")}
          />
          <label htmlFor="raised-button-file">
            <Button variant="contained" component="span">
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
            name="gallery_pics"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <label htmlFor="raised-button-gallery">
                <Button variant="contained" component="span">
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

  // <form onSubmit={reactHookFormSubmit(onSubmit)}>
  //   <input type="file" {...register("profile_pic")} />

  //   <input type="submit" />
  // </form>
};

export default HotelForm;
