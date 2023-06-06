import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GalleryService {
  constructor(private readonly prismaService: PrismaService) {}
  async getAllGallery() {
    const allGallery = await this.prismaService.gallery.findMany();
    return allGallery;
  }
}
