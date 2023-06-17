// favorite.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(hotelId: number, isFavorite: boolean, userId: number) {
    const parsedHotelId = Number(hotelId);
    if (isFavorite) {
      return this.prisma.favorite.create({
        data: {
          user: { connect: { id: userId } },
          hotel: { connect: { id: parsedHotelId } },
        },
      });
    } else {
      return this.prisma.favorite.deleteMany({
        where: {
          user_id: userId,
          hotel_id: parsedHotelId,
        },
      });
    }
  }

  async getUserFavorites(userID: number) {
    return await this.prisma.favorite.findMany({
      where: {
        user: { id: userID },
      },
      include: {
        hotel: true,
      },
    });
  }

  async removeFromFavorites(userId: number, hotelId: number): Promise<boolean> {
    try {
      await this.prisma.favorite.delete({
        where: {
          user_id_hotel_id: {
            user_id: userId,
            hotel_id: hotelId,
          },
        },
      });

      return true;
    } catch (error) {
      console.error('Error removing hotel from favorites:', error);
      throw new Error('Failed to remove hotel from favorites');
    }
  }
}
