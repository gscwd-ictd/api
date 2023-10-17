import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserRolesAddUpdateDTO } from '../data/user-roles.dto';
import { UserRolesService } from './user-roles.service';

@Controller({ version: '1', path: 'user-roles' })
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  async addUserRoles(@Body() userRolesAddUpdateDTO: UserRolesAddUpdateDTO) {
    return await this.userRolesService.addUserRoles(userRolesAddUpdateDTO);
  }

  @Get(':employee_id')
  async getUserRolesByIdMs(@Param('employee_id') employeeId: string) {
    return await this.userRolesService.getUserRolesByUserId(employeeId);
  }

  @Get('users/ems')
  async getEmsUsers() {
    return await this.userRolesService.getEmsUsers();
  }

  @Patch()
  async updateUserRoles(@Body() userRolesAddUpdateDTO: UserRolesAddUpdateDTO) {
    return await this.userRolesService.updateUserRoles(userRolesAddUpdateDTO);
  }

  @Delete(':employee_id')
  async deleteUserRoles(@Param('employee_id') employeeId: string) {
    return await this.userRolesService.deleteUsers(employeeId);
  }

  @Get('users/ems/assignable')
  async getAssignableEmsUsers() {
    return await this.userRolesService.getAssignableEmsUsers();
  }
}
