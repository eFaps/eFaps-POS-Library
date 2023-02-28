import { Currency } from "./currency";
import { Product } from "./product";

export interface Item {
  index: number;
  parentIdx?: number | null;
  product: Product;
  quantity: number;
  price: number;
  currency: Currency;
  exchangeRate: number;
  remark: string | null;
}
