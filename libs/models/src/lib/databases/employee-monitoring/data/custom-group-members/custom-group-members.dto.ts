import { CustomGroups } from '../custom-groups';

export class CreateCustomGroupMembersDto {
  customGroupId: CustomGroups;
  employeeIds: string[];
}
