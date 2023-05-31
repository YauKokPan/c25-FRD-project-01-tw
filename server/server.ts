import cors from "cors";
import express from "express";

const app = express();
declare global {
  namespace Express{
    interface Request{

    }
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import Knex from "knex";

const knexConfig = require("./knexfile");
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);


import {HotelController} from "./controllers/hotelController"
import {HotelService} from "./services/hotelService"

const hotelService = new HotelService(knex);
export const hotelController = new HotelController(hotelService)



import {hotelRoutes} from "./routers/hotelRoutes"

app.use("/hotels",hotelRoutes );


const PORT = 8080;

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
