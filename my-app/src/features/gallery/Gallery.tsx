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
