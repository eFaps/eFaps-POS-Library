import { Product } from './product';

export interface Item {
  product: Product;
  quantity: number;
  price: number;
  remark: string;
}
