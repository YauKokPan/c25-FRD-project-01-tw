import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IPaymentRequestBody } from './types/paymentRequestBody';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createPayment(paymentRequestBody: IPaymentRequestBody): Promise<any> {
    let sum = 0;
    sum +=
      paymentRequestBody.hotel.price_per_hour *
      paymentRequestBody.hotel.total_hours;
    console.log('amount', sum);
    return await this.stripe.paymentIntents.create({
      amount: +sum * 100,
      currency: paymentRequestBody.currency,
      payment_method_types: ['card'],
      // receipt_email: this.configService.get('STRIPE_RECEIPT_EMAIL'),
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });
  }

  //   async createPaymentIntent(amount: number, currency: string) {
  //     const paymentIntent = await this.stripe.paymentIntents.create({
  //       amount,
  //       currency,
  //     });
  //     return {
  //       client_secret: paymentIntent.client_secret,
  //     };
  //   }

  //   async processPayment(paymentMethod: string, paymentIntentId: string) {
  //     const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
  //     await this.stripe.paymentIntents.confirm(paymentIntent.id, {
  //       payment_method: paymentMethod,
  //     });
  //     return paymentIntent;
  //   }
}
