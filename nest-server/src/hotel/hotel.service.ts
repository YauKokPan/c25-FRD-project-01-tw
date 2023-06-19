import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHotelDto } from './dto/create-hotel.dto';

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
      },
    });
    // console.log('allHotels: ', allHotels);
    return allHotels;
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
      is_deleted,
      user_id,
      gallery_key,
    } = createHotelDto;

    const postHotel = await this.prismaService.hotel.create({
      data: {
        user_prisma: { connect: { id: user_id } },
        name,
        address,
        google_map_address,
        district,
        phone,
        profile_pic,
        description,
        total_rooms,
        hourly_rate,
        is_deleted,
        gallery_key: {
          create: gallery_key?.map((image) => ({
            hotel_img: image.hotel_img,
            hotel_name: image.hotel_name,
          })),
        },
      },
    });

    return postHotel;
  }
}
