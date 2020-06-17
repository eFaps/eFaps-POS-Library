import { Product } from "./product";

export interface Category {
  oid: string;
  name: string;
  imageOid?: string;
  weight?: number;
}

export interface PosCategory extends Category {
  products: Product[];
}
