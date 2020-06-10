import { Product } from "./product";

export interface Category {
  oid: string;
  name: string;
  imageOid?: string;
}

export interface PosCategory extends Category {
  products: Product[];
}
