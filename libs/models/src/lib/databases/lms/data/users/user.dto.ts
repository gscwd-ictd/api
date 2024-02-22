import { IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID('all')
  employeeId: string;
}
