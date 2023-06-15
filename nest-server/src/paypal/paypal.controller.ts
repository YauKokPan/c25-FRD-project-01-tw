// paypal.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import client from './paypalEnv';
import * as paypal from '@paypal/checkout-server-sdk';
import { PaypalService, PaymentData } from './paypal.service';

@Controller('paypal')
export class PaypalController {
  constructor(private readonly paypalService: PaypalService) {}

  @Post('create-order')
  async create(
    @Body() createOrderDto: { user_id: number; booking_id: number },
  ) {
    try {
      const PaypalClient = client();
      const request = new paypal.orders.OrdersCreateRequest();
      request.headers['prefer'] = 'return=representation';
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'HKD',
              value: '100.00',
            },
          },
        ],
      });

      const response = await PaypalClient.execute(request);
      if (response.statusCode !== 201) {
        return { status: 500 };
      }

      const orderID = response.result.id;
      const user_id = createOrderDto.user_id; // Use the provided user_id from the request body
      const booking_id = createOrderDto.booking_id; // Use the provided booking_id from the request body

      const paymentData: PaymentData = {
        orderID: orderID,
        status: 'PENDING',
        method: 'paypal',
        user_id: user_id,
        booking_id: booking_id,
      };

      const payment = await this.paypalService.createOrder(paymentData);

      return { orderID: payment.orderID };
    } catch (err: any) {
      console.error('Error in PaypalController:', err);
      return {
        statusCode: 500,
        message: 'Internal server error',
        error: err.message,
      };
    }
  }
}
