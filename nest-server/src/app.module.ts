import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './hotel/hotel.module';
<<<<<<< HEAD
import { BookingsModule } from './bookings/bookings.module';
=======
import { GalleryModule } from './gallery/gallery.module';
>>>>>>> c9a2f1c6b9e42e3adfebff8af17bbe2525fdf0da

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    UserModule,
    PrismaModule,
    AuthModule,
    HotelModule,
<<<<<<< HEAD
    BookingsModule,
=======
    GalleryModule,
>>>>>>> c9a2f1c6b9e42e3adfebff8af17bbe2525fdf0da
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
