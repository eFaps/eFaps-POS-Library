export interface Contact {
  id: string | null;
  oid: string | null;
  name: string;
  idType: IdentificationType;
  idNumber: string;
  email?: string;
  forename?: string;
  firstLastName?: string;
  secondLastName?: string;
}

export enum IdentificationType {
  RUC = "RUC",
  DNI = "DNI",
  CE = "CE",
  PASSPORT = "PASSPORT",
  OTHER = "OTHER",
}
