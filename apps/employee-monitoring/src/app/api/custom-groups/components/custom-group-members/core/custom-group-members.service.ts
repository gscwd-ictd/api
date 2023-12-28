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
    return customGroupMembersDto;
  }

  async unassignCustomGroupMembers(customGroupMembersDto: CreateCustomGroupMembersDto) {
    const { customGroupId, employeeIds } = customGroupMembersDto;
    const deleteResult = await this.rawQuery(`DELETE FROM custom_group_members WHERE custom_group_id_fk=? AND employee_id_fk IN (?);`, [
      customGroupId,
      employeeIds,
    ]);

    return customGroupMembersDto;
  }

  async getCustomGroupMembersDetails(scheduleId: string, dateFrom: Date, dateTo: Date, customGroupId: string) {
    //
    console.log(customGroupId);
    const assignedMembers = (await this.rawQuery(
      `
     SELECT es.employee_id_fk employeeId 
      FROM employee_schedule es 
    INNER JOIN custom_group_members cgm ON es.employee_id_fk = cgm.employee_id_fk 
    WHERE date_from=? AND date_to=? AND schedule_id_fk=? AND cgm.custom_group_id_fk = ?`,
      [dateFrom, dateTo, scheduleId, customGroupId]
    )) as CustomGroupMembers[];

    const employeeIds = await Promise.all(
      assignedMembers.map(async (assignedMember) => {
        return assignedMember.employeeId;
      })
    );

    const employees = await this.client.call({
      action: 'send',
      payload: employeeIds,
      pattern: 'get_custom_group_assigned_member',
      onError: (error) => new NotFoundException(error),
    });
    return employees;
  }

  async getCustomGroupMembers(customGroupId: string, unassigned: boolean) {
    let assignedMembers;

    let pattern = '';
    if (unassigned) {
      assignedMembers = (await this.crudService.findAll({
        find: { select: { employeeId: true } },
        onError: () => new NotFoundException(),
      })) as CustomGroupMembers[];
      pattern = 'get_custom_group_unassigned_member';
    } else {
      assignedMembers = (await this.crudService.findAll({
        find: { select: { employeeId: true }, where: { customGroupId: { id: customGroupId } } },
        onError: () => new NotFoundException(),
      })) as CustomGroupMembers[];
      pattern = 'get_custom_group_assigned_member';
    }

    const employeeIds = await Promise.all(
      assignedMembers.map(async (assignedMember) => {
        return assignedMember.employeeId;
      })
    );

    const employees = await this.client.call({
      action: 'send',
      payload: employeeIds,
      pattern,
      onError: (error) => new NotFoundException(error),
    });

    return employees;
  }
}
