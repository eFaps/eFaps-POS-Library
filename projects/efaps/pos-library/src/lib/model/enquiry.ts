export interface Taxpayer {
  id: string;
  name: string;
  state: string;
  homeState: string;
  ubigeo: string;
  streetType: string;
  street: string;
  zoneCode: string;
  zoneType: string;
  streetNumber: string;
  streetInterior: string;
  streetBatch: string;
  apartmentNumber: string;
  block: string;
  kilometer: string;
  department: string;
  province: string;
  district: string;
  address: string;
}

export interface DNI {
  number: string;
  name: string;
  mothersLastname: string;
  fathersLastname: string;
  fullName: string;
  verificationCode: string;
  gender: string;
  birthDate: string;
  maritalStatus: string;
  location: string;
  locationReniec: string;
  region: string;
  province: string;
  district: string;
  address: string;
  updatedAt: string;
}
