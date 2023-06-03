import { Controller, Get, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
  @Get('allHotels')
  async getAllHotelInfo() {
    return await this.hotelService.getAllHotelInfo();
  }
}
