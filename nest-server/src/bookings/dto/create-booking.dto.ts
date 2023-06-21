import {
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @IsInt()
  hotel_id: number;

  @IsNotEmpty()
  @IsDateString()
  start_time: Date;

  @IsNotEmpty()
  @IsDateString()
  end_time: Date;

  @IsNotEmpty()
  @IsInt()
  total_hours: number;

  @IsNotEmpty()
  @IsNumber()
  total_prices: number;

  @IsNotEmpty()
  @IsString()
  booking_phone: string;

  @IsNotEmpty()
  @IsEmail()
  booking_email: string;

  @IsOptional()
  @IsBoolean()
  is_shown_up?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}
