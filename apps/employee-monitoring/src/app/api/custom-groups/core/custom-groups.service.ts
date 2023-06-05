import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateCustomGroupMembersDto, CreateCustomGroupsDto, CustomGroups, UpdateCustomGroupsDto } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomGroupMembersService } from '../components/custom-group-members/core/custom-group-members.service';

@Injectable()
export class CustomGroupsService extends CrudHelper<CustomGroups> {
  constructor(private readonly crudService: CrudService<CustomGroups>, private readonly customGroupMembersService: CustomGroupMembersService) {
    super(crudService);
  }

  async createCustomGroup(customGroupDto: CreateCustomGroupsDto) {
    return await this.crudService.create({
      dto: customGroupDto,
      onError: () => new InternalServerErrorException(),
    });
  }

  async unassignCustomGroupMembers(customGroupMembersDto: CreateCustomGroupMembersDto) {
    return await this.customGroupMembersService.unassignCustomGroupMembers(customGroupMembersDto);
  }

  async addCustomGroupMembers(customGroupMemberDto: CreateCustomGroupMembersDto) {
    return await this.customGroupMembersService.assignCustomGroupMembers(customGroupMemberDto);
  }

  async getCustomGroupUnassignedMembers(customGroupId: string) {
    return await this.customGroupMembersService.getCustomGroupMembers(customGroupId, true);
  }

  async getCustomGroupAssignedMembers(customGroupId: string) {
    return await this.customGroupMembersService.getCustomGroupMembers(customGroupId, false);
  }

  async assignCustomGroupMembers(customGroupMembersDto: CreateCustomGroupMembersDto) {
    return await this.customGroupMembersService.assignCustomGroupMembers(customGroupMembersDto);
  }

  async updateCustomGroup(customGroupsDto: UpdateCustomGroupsDto) {
    const { id, ...rest } = customGroupsDto;
    const updateResult = await this.crud().update({
      dto: rest,
      updateBy: { id },
      onError: () => new InternalServerErrorException(),
    });

    if (updateResult.affected > 0) return customGroupsDto;
  }

  async deleteCustomGroup(id: string) {
    const customGroup = await this.crud().findOneOrNull({ find: { where: { id } } });
    const deleteCustomGroupMembersResult = await this.customGroupMembersService
      .crud()
      .delete({ deleteBy: { customGroupId: { id } }, softDelete: false });
    const deleteCustomGroup = await this.crud().delete({ deleteBy: { id }, softDelete: false });
    if (deleteCustomGroup.affected > 0) return customGroup;
  }

  async getCustomGroupDetails(customGroupId: string) {
    const customGroupDetails = await this.crudService.findOneOrNull({ find: { where: { id: customGroupId } } });
    try {
      const members = await this.getCustomGroupAssignedMembers(customGroupId);
      return { customGroupDetails, members };
    } catch {
      return { customGroupDetails, members: [] };
    }
  }
}
