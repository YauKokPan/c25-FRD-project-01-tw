import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './hotel/hotel.module';
import { BookingsModule } from './bookings/bookings.module';
import { GalleryModule } from './gallery/gallery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    UserModule,
    PrismaModule,
    AuthModule,
    HotelModule,
    BookingsModule,
    GalleryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
