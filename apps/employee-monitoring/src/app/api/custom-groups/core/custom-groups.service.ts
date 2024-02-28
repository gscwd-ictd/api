import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateCustomGroupMembersDto, CreateCustomGroupsDto, CustomGroups, UpdateCustomGroupsDto } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EmployeeRestDaysService } from '../../daily-time-record/components/employee-schedule/components/employee-rest-day/components/employee-rest-days/core/employee-rest-days.service';
import { ScheduleSheetService } from '../../daily-time-record/components/schedule-sheet/core/schedule-sheet.service';
import { CustomGroupMembersService } from '../components/custom-group-members/core/custom-group-members.service';
import { ScheduleBase } from '@gscwd-api/utils';

@Injectable()
export class CustomGroupsService extends CrudHelper<CustomGroups> {
  constructor(
    private readonly crudService: CrudService<CustomGroups>,
    private readonly customGroupMembersService: CustomGroupMembersService,
    private readonly scheduleSheetService: ScheduleSheetService,
    private readonly employeeRestDaysService: EmployeeRestDaysService
  ) {
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

  async getCustomGroupUnassignedMembersDropDown(customGroupId: string, isRankFile: boolean) {
    const unassignedMembers = (await this.customGroupMembersService.getCustomGroupMembers(customGroupId, true, isRankFile)) as {
      employeeId: string;
      fullName: string;
      positionTitle: string;
      assignment: string;
    }[];

    const dropdown = await Promise.all(
      unassignedMembers.map(async (unassignedMember) => {
        const { fullName, ...rest } = unassignedMember;
        return { label: fullName, value: rest };
      })
    );
    return dropdown;
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
    const employeeSchedule = await this.rawQuery(`UPDATE employee_schedule SET custom_group_id_fk = null WHERE custom_group_id_fk = ?`, [id]);
    const deleteCustomGroupMembersResult = await this.customGroupMembersService
      .crud()
      .delete({ deleteBy: { customGroupId: { id } }, softDelete: false });
    const deleteCustomGroup = await this.crud().delete({ deleteBy: { id }, softDelete: false });
    if (deleteCustomGroup.affected > 0) return customGroup;
  }

  async getCustomGroupDetails(customGroupId: string, scheduleId?: string, dateFrom?: Date, dateTo?: Date) {
    const customGroupDetails = await this.crudService.findOneOrNull({ find: { where: { id: customGroupId } } });
    try {
      let members = [];

      if (typeof scheduleId !== 'undefined' && typeof dateFrom !== 'undefined' && typeof dateTo !== 'undefined') {
        console.log('here here hreasda');
        console.log(scheduleId, dateFrom, dateTo, customGroupId, 'asd');
        members = (await this.customGroupMembersService.getCustomGroupMembersDetails(scheduleId, dateFrom, dateTo, customGroupId)) as {
          employeeId: string;
          companyId: string;
          fullName: string;
          positionTitle: string;
          assignment: string;
        }[];
      } else {
        //   console.log('else');
        members = (await this.getCustomGroupAssignedMembers(customGroupId)) as {
          employeeId: string;
          companyId: string;
          fullName: string;
          positionTitle: string;
          assignment: string;
        }[];
      }
      const membersWithRestdays = await Promise.all(
        members.map(async (member) => {
          const restDays = (await this.rawQuery(
            `
            SELECT rest_day restDay, date_from dateFrom
            FROM employee_rest_days emrs 
            INNER JOIN employee_rest_day emr ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk
            WHERE emr.employee_id_fk = ? 
            AND date_from = ? AND date_to = ? GROUP BY dateFrom, restDay ORDER BY date_from ASC,rest_day ASC;
            `,
            [member.employeeId, dateFrom, dateTo]
          )) as {
            restDay: string;
          }[];
          const modifiedRestdays = await Promise.all(
            restDays.map(async (restDay) => {
              return parseInt(restDay.restDay);
            })
          );
          return { ...member, restDays: modifiedRestdays };
        })
      );
      console.log({ customGroupDetails, members: membersWithRestdays });
      return { customGroupDetails, members: membersWithRestdays };
    } catch {
      return { customGroupDetails, members: [] };
    }
  }

  async getAllScheduleSheet(scheduleBase: ScheduleBase) {
    return await this.scheduleSheetService.getAllScheduleSheet(scheduleBase);
  }
}
