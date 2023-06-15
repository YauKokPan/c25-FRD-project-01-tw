import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './hotel/hotel.module';
import { BookingsModule } from './bookings/bookings.module';
import { GalleryModule } from './gallery/gallery.module';
import { ContactUsModule } from './contactUs/contactUs.module';
import { CommentsModule } from './comments/comments.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from './user/user.module';
import { PaypalModule } from './paypal/paypal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    UserModule,
    PrismaModule,
    AuthModule,
    HotelModule,
    BookingsModule,
    GalleryModule,
    ContactUsModule,
    CommentsModule,
    CommentsModule,
    PaymentModule,
    PaypalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
