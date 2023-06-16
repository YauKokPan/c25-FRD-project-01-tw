import { Injectable, NotFoundException } from '@nestjs/common';
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
      remarks,
    } = data;

    // Check if the User record exists
    const user = await this.prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${user_id}' not found.`);
    }

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
        remarks,
      },
    });

    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany();
  }
  async findLatestBooking(): Promise<Booking> {
    return this.prisma.booking.findFirst({
      orderBy: {
        id: 'desc',
      },
      include: {
        user_booking_key: true,
        hotel_booking_key: true,
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Booking[]> {
    return await this.prisma.booking.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user_booking_key: true,
        hotel_booking_key: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findUserLatestBooking(): Promise<Booking[]> {
    return await this.prisma.booking.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
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
