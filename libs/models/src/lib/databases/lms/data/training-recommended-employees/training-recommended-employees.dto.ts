import { IsUUID } from 'class-validator';

export class CreateRecommendedEmployeeDto {
  @IsUUID('all')
  employeeId: string;
}
