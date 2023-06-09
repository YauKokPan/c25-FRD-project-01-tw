import { IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  user_id: number;

  //   @IsNotEmpty()
  hotel_id: number;

  //   @IsNotEmpty()
  @IsDateString()
  start_time: Date;

  //   @IsNotEmpty()
  @IsDateString()
  end_time: Date;

  //   @IsNotEmpty()
  total_hours: number;

  //   @IsNotEmpty()
  total_price: number;

  booking_phone: string;

  booking_email: string;

  is_shown_up: boolean;
}
