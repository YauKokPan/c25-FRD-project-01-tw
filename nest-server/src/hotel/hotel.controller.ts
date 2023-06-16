import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}
  @Get('allHotels')
  async getAllHotelInfo() {
    // console.log('/hotel/allHotels');
    return await this.hotelService.getAllHotelInfo();
  }

  @Post('create')
  async create(@Body() createHotelDto: CreateHotelDto) {
    const postHotel = await this.hotelService.createHotel(createHotelDto);
    return postHotel;
  }
}
