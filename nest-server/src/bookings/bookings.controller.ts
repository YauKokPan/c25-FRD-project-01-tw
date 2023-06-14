import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    const result = await this.bookingsService.createBooking(createBookingDto);
    return result;
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('latest')
  findLatestBooking() {
    return this.bookingsService.findLatestBooking();
  }

  @Get(':userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.bookingsService.findAllByUserId(+userId);
  }

  @Get('latest')
  findUserLatestBooking() {
    return this.bookingsService.findUserLatestBooking();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBooking(
    @Param('id') id: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const updatedBooking = await this.bookingsService.updateBooking(
      id,
      updateBookingDto,
    );
    return { message: 'Booking updated successfully', booking: updatedBooking };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
