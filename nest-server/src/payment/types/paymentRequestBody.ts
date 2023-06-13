import { IProduct } from './product';

export interface IPaymentRequestBody {
  products: IProduct[];
  currency: string;
}
