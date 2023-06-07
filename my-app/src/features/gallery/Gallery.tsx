import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { FreeMode, Pagination } from "swiper";
import "swiper/css/free-mode";

type GalleryProps = {
  hotel: {
    gallery_key: {
      hotel_img: string | undefined;
      hotel_name: string | undefined;
    }[];
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
  );
};

export default Gallery;
