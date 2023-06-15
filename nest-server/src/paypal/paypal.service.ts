import { PrismaService } from 'src/prisma/prisma.service';
import { Payment } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface PaymentData {
  orderID: string;
  status: string;
  method: string;
  user_id: number;
  booking_id: number;
}

@Injectable()
export class PaypalService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(paymentData: PaymentData): Promise<Payment> {
    const postPaypalOrder = await this.prisma.payment.create({
      data: {
        orderID: paymentData.orderID,
        status: paymentData.status,
        method: paymentData.method,
        user_payment_key: { connect: { id: paymentData.user_id } },
        booking_payment_key: { connect: { id: paymentData.booking_id } },
      },
    });

    return postPaypalOrder;
  }
}
