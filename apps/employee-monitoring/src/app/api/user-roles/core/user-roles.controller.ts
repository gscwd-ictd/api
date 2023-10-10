import { Body, Controller, Post } from '@nestjs/common';
import { UserRolesAddUpdateDTO } from '../data/user-roles.dto';
import { UserRolesService } from './user-roles.service';

@Controller({ version: '1', path: 'user-roles' })
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  async addUserRoles(@Body() userRolesAddUpdateDTO: UserRolesAddUpdateDTO) {
    return await this.userRolesService.addUserRoles(userRolesAddUpdateDTO);
  }
}
