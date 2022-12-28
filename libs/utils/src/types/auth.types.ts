export type Credentials = {
  email: string;
  password: string;
};

export type Employee = {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  nameExt: string;
  sex: 'Male' | 'Female';
  birthDate: Date;
  mobileNumber: string;
  photoUrl: string;
};

export type RegistrationDetails = {
  credentials: Credentials;
  details: Employee;
};
