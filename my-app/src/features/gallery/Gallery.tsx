// Gallery.tsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper";
import "swiper/css/free-mode";
import { GalleryKey, Hotel } from "../hotel/hotelAPI";

type GalleryProps = {
  hotel: {
    id: Hotel["id"];

    gallery_key: GalleryKey[];
  };
};

const Gallery: React.FC<GalleryProps> = ({ hotel }) => {
  return (
    <div className="hotel-gallery">
      <Swiper
        breakpoints={{
          480: {
            slidesPerView: 1,
          },
          720: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
          1600: {
            slidesPerView: 5,
          },
          1920: {
            slidesPerView: 6,
          },
          2560: {
            slidesPerView: 7,
          },
          3840: {
            slidesPerView: 8,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        {hotel.gallery_key.map(
          (galleryItem: GalleryKey, index: Hotel["id"]) => (
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
  );
};

export default Gallery;
