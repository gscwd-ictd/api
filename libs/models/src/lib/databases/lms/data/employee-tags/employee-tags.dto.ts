import { IsArray, IsUUID } from 'class-validator';

export class CreateEmployeeTagDto {
  @IsArray()
  employees: string[];

  @IsArray()
  tags: string[];
}

export class DeleteEmployeeTagDto {
  @IsUUID('all')
  employeeId: string;

  @IsUUID('4')
  tagId: string;
}
