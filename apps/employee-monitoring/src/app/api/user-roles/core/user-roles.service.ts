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
}
