import { Injectable } from '@nestjs/common';
import { Booking } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const {
      user_id,
      room_id,
      start_time,
      end_time,
      total_hours,
      total_price,
      booking_phone,
      booking_email,
    } = data;

    const booking = await this.prisma.booking.create({
      data: {
        user_booking_key: { connect: { id: user_id } },
        room_booking_key: { connect: { id: room_id } },
        start_time,
        end_time,
        total_hours,
        total_price,
        booking_phone,
        booking_email,
        is_shown_up: true,
      },
    });

    return booking;
  }

  findAll() {
    return `This action returns all bookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  updateBooking(id: number, _updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
