import React from "react";
import { useParams } from "react-router-dom";
import Title from "../title/Title";
import { UseHotelInfo } from "./hotelAPI";
import Equipment from "../equipment/Equipment";
import "./HotelList.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper";
import "swiper/css/free-mode";

export default function HotelDetail() {
  let { hotelId } = useParams();
  const hotelIdNum = Number(hotelId);
  const hotelInfo = UseHotelInfo();

  // Find the specific hotel using the hotelId
  const hotel = hotelInfo.find((hotel) => hotel.id === hotelIdNum);

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container">
      <Title mainTitle="酒店資料" />
      <h2>{hotel.name}</h2>
      <p>地址: {hotel.address}</p>
      <p>地區: {hotel.district}</p>
      <p>電話: {hotel.phone}</p>
      <p>描述: {hotel.description}</p>
      <div dangerouslySetInnerHTML={{ __html: hotel.google_map_address }} />
      <Equipment />
      <div className="hotel-gallery">
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
          {hotel.gallery_key.map(
            (
              galleryItem: {
                hotel_img: string | undefined;
                hotel_name: string | undefined;
              },
              index: React.Key | null | undefined
            ) => (
              <SwiperSlide key={index}>
                <img
                  src={galleryItem.hotel_img}
                  alt={galleryItem.hotel_name}
                  className="img-fluid"
                />
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </div>
  );
}
