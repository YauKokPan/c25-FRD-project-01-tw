import { IsNotEmpty } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  google_map_address: string;

  @IsNotEmpty()
  district: string;

  phone: string;

  profile_pic: string;

  description: string;

  total_rooms: number;

  hourly_rate: number;

  is_deleted: boolean;

  is_favorite: boolean;

  user_id: number;
}
