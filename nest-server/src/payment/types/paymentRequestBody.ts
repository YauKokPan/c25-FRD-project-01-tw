import { IHotel } from './hotel';

export interface IPaymentRequestBody {
  hotel: IHotel;
  currency: string;
}
