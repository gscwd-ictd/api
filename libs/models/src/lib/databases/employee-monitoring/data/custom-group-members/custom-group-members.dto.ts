import { IsArray } from 'class-validator';
import { CustomGroups } from '../custom-groups';

export class CreateCustomGroupMembersDto {
  customGroupId: CustomGroups;

  @IsArray()
  employeeIds: string[];
}
