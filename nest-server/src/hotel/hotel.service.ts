import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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
    console.log('allHotels: ', allHotels);
    return allHotels;
  }
}
