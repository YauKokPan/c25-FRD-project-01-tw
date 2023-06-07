import React from "react";
import { useLocation } from "react-router-dom";
import { UseHotelInfo } from "../hotel/hotelAPI";

interface Hotel {
  gallery_key: any;
  id: number;
  name: string;
  address: string;
  district: string;
  phone: string;
  description: string;
  profile_pic: string;
  user_id: number;
  google_map_address: string;
}

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";
  const allHotels: Hotel[] = UseHotelInfo();
  const filteredHotels = allHotels.filter((hotel) =>
    hotel.name.includes(searchQuery)
  );

  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      <ul>
        {filteredHotels.map((hotel) => (
          <li key={hotel.id}>
            <a href={`/hotels/${hotel.id}`}>{hotel.name}</a>
            <p>{hotel.address}</p>
            <p>{hotel.district}</p>
            <p>{hotel.phone}</p>
            <p>{hotel.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}