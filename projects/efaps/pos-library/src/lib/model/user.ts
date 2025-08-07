export interface User {
  employeeOid?: string;
  username: string;
  firstName: string;
  surName: string;
}

export enum Permission {
  ADMIN = "ADMIN",
  COLLECT = "COLLECT",
  ORDER = "ORDER",
  CREDITNOTE = "CREDITNOTE",
  REDEEM_CREDITNOTE = "REDEEM_CREDITNOTE",
}
