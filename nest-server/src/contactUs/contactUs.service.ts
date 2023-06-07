import { Injectable } from '@nestjs/common';
import { ContactUsDto } from './dto/contactUs.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactUsService {
  constructor(private readonly prisma: PrismaService) {}

  async createContactUs(contactUsDto: ContactUsDto) {
    try {
      const result = await this.prisma.contactUs.create({
        data: contactUsDto,
      });
      return result;
    } catch (error) {
      throw new Error(`Could not create contact us: ${error.message}`);
    }
  }
}
