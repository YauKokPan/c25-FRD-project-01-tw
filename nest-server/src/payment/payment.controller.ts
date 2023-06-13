import { Controller, Post, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { IPaymentRequestBody } from './types/paymentRequestBody';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  createPayment(
    @Res() response: Response,
    @Body() paymentRequestBody: IPaymentRequestBody,
  ) {
    this.paymentService
      .createPayment(paymentRequestBody)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
  }
}

//   @Post('create-payment-intent')
//   async createPaymentIntent(@Body() body: { amount: number; currency: string }) {
//     const { amount, currency } = body;
//     const paymentIntent = await this.paymentService.createPaymentIntent(amount, currency);
//     return { data: paymentIntent };
//   }

//   @Post('process-payment')
//   async processPayment(@Body() body: { paymentMethod: string; paymentIntentId: string }) {
//     const { paymentMethod, paymentIntentId } = body;
//     const paymentIntent = await this.paymentService.processPayment(paymentMethod, paymentIntentId);
//     return { data: paymentIntent };
//   }}
