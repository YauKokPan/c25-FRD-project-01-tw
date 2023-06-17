// favorite.controller.ts
import {
  Controller,
  Param,
  Body,
  ParseIntPipe,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Patch(':hotelId')
  async toggleFavorite(
    @Param('hotelId') hotelId: number,
    @Body('is_favorite') isFavorite: boolean,
    @Body('user_id') userId: number,
  ) {
    return this.favoriteService.toggleFavorite(hotelId, isFavorite, userId);
  }

  @Get(':userID')
  async getUserFavorites(@Param('userID', ParseIntPipe) userID: number) {
    return await this.favoriteService.getUserFavorites(userID);
  }

  @Delete(':userId/:hotelId')
  async removeFromFavorites(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('hotelId', ParseIntPipe) hotelId: number,
  ): Promise<boolean> {
    return this.favoriteService.removeFromFavorites(userId, hotelId);
  }
}
