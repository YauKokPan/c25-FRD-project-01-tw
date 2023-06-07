import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContactUsController } from './contactUs.controller';
import { ContactUsService } from './contactUs.service';

@Module({
  imports: [PrismaModule],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
