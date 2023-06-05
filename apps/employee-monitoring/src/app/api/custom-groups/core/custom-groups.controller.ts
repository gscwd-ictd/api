import { CreateCustomGroupMembersDto, CreateCustomGroupsDto, UpdateCustomGroupsDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CustomGroupsService } from './custom-groups.service';

@Controller({ version: '1', path: 'custom-groups' })
export class CustomGroupsController {
  constructor(private readonly customGroupsService: CustomGroupsService) {}

  @Post()
  async createCustomGroup(@Body() customGroupDto: CreateCustomGroupsDto) {
    return await this.customGroupsService.createCustomGroup(customGroupDto);
  }

  @Post('members')
  async addCustomGroupMembers(@Body() customGroupMembersDto: CreateCustomGroupMembersDto) {
    return await this.customGroupsService.assignCustomGroupMembers(customGroupMembersDto);
  }

  @Delete('members')
  async unassignCustomGroupMembers(@Body() customGroupMembersDto: CreateCustomGroupMembersDto) {
    return await this.customGroupsService.unassignCustomGroupMembers(customGroupMembersDto);
  }

  @Put()
  async updateCustomGroup(@Body() customGroupDto: UpdateCustomGroupsDto) {
    return await this.customGroupsService.updateCustomGroup(customGroupDto);
  }

  @Get()
  async getAllCustomGroups() {
    return await this.customGroupsService.crud().findAll({ find: { order: { name: 'ASC' } } });
  }

  @Get(':custom_group_id')
  async getCustomGroupDetails(@Param('custom_group_id') customGroupId: string) {
    return await this.customGroupsService.getCustomGroupDetails(customGroupId);
  }

  @Get(':custom_group_id/unassigned')
  async getCustomGroupUnassignedMembers(@Param('custom_group_id') customGroupId: string) {
    return await this.customGroupsService.getCustomGroupUnassignedMembers(customGroupId);
  }

  @Get(':custom_group_id/assigned')
  async getCustomGroupAssignedMembers(@Param('custom_group_id') customGroupId: string) {
    return await this.customGroupsService.getCustomGroupAssignedMembers(customGroupId);
  }

  @Delete(':custom_group_id')
  async deleteCustomGroup(@Param('custom_group_id') id: string) {
    return await this.customGroupsService.deleteCustomGroup(id);
  }
}
