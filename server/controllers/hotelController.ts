import { HotelService} from "../services/hotelService";
import type { Request, Response } from "express";

export class HotelController {
  constructor(private hotelService: HotelService) {}

  getAllHotels = async (_req: Request, res: Response) => {
    try {
      const hotels = await this.hotelService.getAllHotels();
      res.json(hotels); // pass array into res.json()
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getHotelsById = async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      const serviceResponse = await this.hotelService.getHotelsById(id);
      res.status(200).json({ data: serviceResponse });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "internal server error" });
    }
  };
}