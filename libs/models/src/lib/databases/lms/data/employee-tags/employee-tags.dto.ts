import { IsArray } from 'class-validator';

export class CreateEmployeeTags {
  @IsArray()
  employees: string[];

  @IsArray()
  tags: string[];
}
