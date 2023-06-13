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
      hotel_id,
      start_time,
      end_time,
      total_hours,
      total_price,
      booking_phone,
      booking_email,
      is_shown_up,
      remarks,
    } = data;

    const booking = await this.prisma.booking.create({
      data: {
        user_booking_key: { connect: { id: user_id } },
        hotel_booking_key: { connect: { id: hotel_id } },
        start_time,
        end_time,
        total_hours,
        total_price,
        booking_phone,
        booking_email,
        is_shown_up: true,
        remarks,
      },
    });

    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany();
  }

  async findOne(id: number): Promise<Booking | null> {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  async updateBooking(
    id: number,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async remove(id: number): Promise<Booking> {
    return this.prisma.booking.delete({ where: { id } });
  }
}
