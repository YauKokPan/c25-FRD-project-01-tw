import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ContactUsService } from './contactUs.service';
import { ContactUsDto } from './dto/contactUs.dto';

@Controller('contactUs')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() contactUsDto: ContactUsDto) {
    const result = await this.contactUsService.createContactUs(contactUsDto);
    return { message: 'Contact Us added successfully', data: result };
  }
}
