export interface Contact {
  id: string;
  oid: string;
  name: string;
  idType: IdentificationType;
  idNumber: string;
  email?: string;
}

export enum IdentificationType {
  RUC = "RUC",
  DNI = "DNI",
  CE = "CE",
  PASSPORT = "PASSPORT",
  OTHER = "OTHER",
}
