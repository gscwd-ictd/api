import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRolesAddUpdateDTO } from '../data/user-roles.dto';

@Injectable()
export class UserRolesService {
  constructor(private readonly client: MicroserviceClient) {}

  async addUserRoles(userRolesAddUpdateDTO: UserRolesAddUpdateDTO) {
    return await this.client.call({
      action: 'send',
      payload: userRolesAddUpdateDTO,
      pattern: 'add_user_roles',
      onError: () => new InternalServerErrorException(),
    });
  }

  async getUserRolesByUserId(userId: string) {
    return await this.client.call({
      action: 'send',
      payload: { userId, app: 'ems' },
      pattern: 'get_user_roles_by_id_and_app',
      onError: () => new NotFoundException(),
    });
  }

  async updateUserRoles(userRolesAddUpdateDTO: UserRolesAddUpdateDTO) {
    //
    return await this.client.call({
      action: 'send',
      payload: userRolesAddUpdateDTO,
      pattern: 'update_user_roles',
      onError: () => new NotFoundException(),
    });
  }

  async getEmsUsers() {
    return await this.client.call({
      action: 'send',
      payload: 'ems',
      pattern: 'get_hrms_users_by_app',
      onError: () => new NotFoundException(),
    });
  }

  async deleteUsers(employeeId: string) {
    return await this.client.call({
      action: 'send',
      payload: employeeId,
      pattern: 'delete_user_role_id',
      onError: () => new NotFoundException(),
    });
  }

  async getAssignableEmsUsers() {
    const emsUsers = (await this.client.call({
      action: 'send',
      payload: {},
      pattern: 'get_assignable_ems_users',
      onError: () => new NotFoundException(),
    })) as {
      label: string;
      value: {
        employeeId: string;
        fullName: string;
        positionTitle: string;
      };
    }[];

    const emsUsersResult = await Promise.all(
      emsUsers.map(async (emsUser) => {
        return { label: emsUser.label, value: emsUser.value.employeeId };
      })
    );

    return emsUsersResult;
  }
}
