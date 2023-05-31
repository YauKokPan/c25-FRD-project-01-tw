import { hotelController } from "../server";
import express, { Request, Response } from "express";

export const hotelRoutes = express.Router();

hotelRoutes.get("/", hotelController.getAllHotels);
hotelRoutes.get("/:id", hotelController.getHotelsById);