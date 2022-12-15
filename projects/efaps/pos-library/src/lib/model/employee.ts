export interface Employee {
  oid: String;
  firstName: String;
  surName: String;
}

export enum EmployeeRelationType {
  SELLER = "SELLER",
}

export interface EmployeeRelation {
  employeeOid: String;
  type: EmployeeRelationType;
}
