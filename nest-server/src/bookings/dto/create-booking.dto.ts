import { IsNotEmpty, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  user_id: number;

  //   @IsNotEmpty()
  room_id: number;

  //   @IsNotEmpty()
  @IsDate()
  start_time: Date;

  //   @IsNotEmpty()
  @IsDate()
  end_time: Date;

  //   @IsNotEmpty()
  total_hours: number;

  //   @IsNotEmpty()
  total_price: number;

  is_shown_up: boolean;
}
