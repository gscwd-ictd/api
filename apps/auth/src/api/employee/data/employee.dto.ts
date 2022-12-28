export class CreateEmployeeDto {
  userId: string;
  firstName: string;
  middleName: string;
  nameExt: string;
  sex: 'Male' | 'Female';
  birthDate: Date;
  mobileNumber: string;
  photoUrl: string;
}
