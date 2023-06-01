export interface User {
  employeeOid?: string;
  username: string;
  firstName: string;
  surName: string;
}

export enum Roles {
  ADMIN,
  USER,
}
