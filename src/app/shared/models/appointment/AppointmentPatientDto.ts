export interface AppointmentPatientDto {
  createdAt: String;
  createdBy: String;
  email: String;
  firstName: String;
  id: Number;
  lastName: String;
  updatedAt: String;
  updatedBy: String;
}

export interface AppointmentPatientDetail {
  createdAt: String;
  createdBy: String;
  email: String;
  firstName: String;
  id: Number;
  lastName: String;
  updatedAt: String;
  updatedBy: String;
  city: String;
  state: String;
  country: String;
  zipcode: String;
  notes: String;
  addressLine1: String;
  addressLine2: String;
  phone: String;
  dateOfBirth: any;
  gender: String;
  profileImageUrl?: string;
  patientStatus: String;
  isSmsOptedIn: any;
}
