import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from '@prisma/client';

@Injectable()
export class HotelService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllHotelInfo() {
    const allHotels = await this.prismaService.hotel.findMany({
      include: {
        gallery_key: {
          select: {
            hotel_img: true,
          },
        },
        comment_key: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            comment_key: true,
          },
        },
      },
    });

    // Map the results to include totalComments and averageRating in the return value
    const hotelsWithTotalComments = allHotels.map((hotel) => ({
      ...hotel,
      totalRating: hotel._count.comment_key,
      averageRatingArray: hotel.comment_key,
    }));

    return hotelsWithTotalComments;
  }

  async createHotel(createHotelDto: CreateHotelDto) {
    const {
      name,
      address,
      google_map_address,
      district,
      phone,
      profile_pic,
      description,
      total_rooms,
      hourly_rate,
      user_id,
      gallery_key,
    } = createHotelDto;

    const postHotel = await this.prismaService.hotel.create({
      data: {
        user_prisma: { connect: { id: +user_id } },
        name,
        address,
        google_map_address,
        district,
        phone,
        profile_pic: profile_pic,
        description,
        total_rooms: +total_rooms,
        hourly_rate: +hourly_rate,
        is_deleted: false,
        gallery_key: {
          create: gallery_key,
        },
      },
    });

    return postHotel;
  }

  async softDeleteHotel(id: number): Promise<void> {
    await this.prismaService.hotel.update({
      where: { id },
      data: { is_deleted: true },
    });
  }

  async editHotel(id: number, updateHotelDto: UpdateHotelDto): Promise<void> {
    await this.prismaService.hotel.update({
      where: { id },
      data: {
        name: updateHotelDto.name,
        address: updateHotelDto.address,
        phone: updateHotelDto.phone,
      },
    });
  }

  async getOccupancyRates(id: number) {
    const hotels = await this.prismaService.hotel.findMany({
      where: { id },
      include: {
        booking_key: true,
      },
    });

    const occupancyRates = hotels.map((hotel) => {
      const bookedRooms = hotel.booking_key.length;
      const totalRooms = hotel.total_rooms;
      const occupancyRate = (bookedRooms / totalRooms) * 100;

      return {
        occupancyRate,
        bookedRooms,
      };
    });

    return occupancyRates;
  }

  // async getAverageRatings(id: number) {
  //   const hotels = await this.prismaService.hotel.findMany({
  //     where: { id },
  //     include: {
  //       comment_key: true,
  //     },
  //   });

  //   const averageRatings = hotels.map((hotel) => {
  //     const totalRatings = hotel.comment_key.reduce((sum, comment) => {
  //       return sum + comment.rating;
  //     }, 0);

  //     const averageRating =
  //       hotel.comment_key.length > 0
  //         ? totalRatings / hotel.comment_key.length
  //         : 0;

  //     return {
  //       averageRating: parseFloat(averageRating.toFixed(1)),
  //       totalComments: hotel.comment_key.length,
  //     };
  //   });

  //   return averageRatings;
  // }
}
