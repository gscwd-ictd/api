import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { CreateCustomGroupMembersDto, CustomGroupMembers } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class CustomGroupMembersService extends CrudHelper<CustomGroupMembers> {
  constructor(private readonly crudService: CrudService<CustomGroupMembers>, private readonly client: MicroserviceClient) {
    super(crudService);
  }

  async assignCustomGroupMembers(customGroupMembersDto: CreateCustomGroupMembersDto) {
    const { employeeIds, customGroupId } = customGroupMembersDto;
    const customGroupMembers = await Promise.all(
      employeeIds.map(async (employeeId) => {
        const members = await this.crud().create({ dto: { customGroupId, employeeId }, onError: () => new InternalServerErrorException() });
        return { customGroupId: members.customGroupId, employeeId: members.employeeId };
      })
    );
    return { customGroupId, members: customGroupMembers };
  }

  async unassignCustomGroupMembers(customGroupMembersDto: CreateCustomGroupMembersDto) {
    const { customGroupId, employeeIds } = customGroupMembersDto;
    const deleteResult = await this.rawQuery(`DELETE FROM custom_group_members WHERE custom_group_members_id=? AND employee_id_fk IN (?);`, [
      customGroupId,
      employeeIds,
    ]);

    return customGroupMembersDto;
  }

  async getCustomGroupMembers(customGroupId: string, unassigned: boolean) {
    const assignedMembers = (await this.crudService.findAll({
      find: { select: { employeeId: true }, where: { customGroupId: { id: customGroupId } } },
      onError: () => new NotFoundException(),
    })) as CustomGroupMembers[];

    const employeeIds = await Promise.all(
      assignedMembers.map(async (assignedMember) => {
        return assignedMember.employeeId;
      })
    );

    let pattern = '';
    if (unassigned) pattern = 'get_custom_group_unassigned_member';
    else pattern = 'get_custom_group_assigned_member';

    const employees = await this.client.call({
      action: 'send',
      payload: employeeIds,
      pattern,
      onError: (error) => new NotFoundException(error),
    });

    return employees;
  }
}
