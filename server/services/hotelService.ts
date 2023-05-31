import { Hotels } from "../model";
import type { Knex } from "knex";

export class HotelService {
  static getAllHotels: any;
  constructor(private knex: Knex) {}

  getAllHotels = async () => {
    const queryResult = await this.knex<Hotels>("hotels").select(
      "id",
      "name",
      "address",
      "district",
      "phone",
      "profile_pic",
      "description"
    );

    return queryResult;
  };

  getHotelsById = async (id: number) => {
    const result = await this.knex<Hotels>("hotels")
      .select("*")
      .where("hotels.id", id);
    return result;
  };
}
