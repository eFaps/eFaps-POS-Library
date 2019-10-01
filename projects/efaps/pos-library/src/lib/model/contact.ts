export interface Contact {
  id: string;
  oid: string;
  name: string;
  idType: IdentificationType;
  idNumber: string;
}

export enum IdentificationType {
  RUC,
  DNI,
  CE,
  PASSPORT,
  OTHER
}
