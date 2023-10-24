export class UserRolesDTO {
  _id?: string;
  userId: string;
  moduleId: string;
  hasAccess: boolean;
  module?: string;
  slug?: string;
  url?: string;
}

export type UserRoleAddUpdate = Omit<UserRolesDTO, 'userId'>;

export class UserRolesAddUpdateDTO {
  employeeId?: string;
  userRoles: UserRoleAddUpdate[];
}
