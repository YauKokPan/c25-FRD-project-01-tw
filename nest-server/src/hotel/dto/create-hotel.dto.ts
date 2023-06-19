export class GalleryImageDto {
  hotel_img: string;
  hotel_name: string;
}

export class CreateHotelDto {
  name: string;
  address: string;
  google_map_address: string;
  district: string;
  phone: string;
  profile_pic: string;
  description: string;
  total_rooms: number;
  hourly_rate: number;
  is_deleted: boolean;
  user_id: number;
  gallery_key: GalleryImageDto[];
}
