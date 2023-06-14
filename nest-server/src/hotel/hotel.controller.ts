import { Controller, Get, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
  @Get('allHotels')
  async getAllHotelInfo() {
    console.log('/hotel/allHotels');
    return await this.hotelService.getAllHotelInfo();
  }
}
