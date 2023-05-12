export interface Category {
  oid: string;
  name: string;
  imageOid?: string;
  weight?: number;
  parentOid?: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
