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
    const assignedMembers = (await this.rawQuery(
      `
      SELECT DISTINCT 
        es.employee_id_fk employeeId, 
        emp.company_id companyId,
        ${process.env.HRMS_DB_NAME}get_employee_fullname2(es.employee_id_fk) fullName,
        pp.position_title positionTitle,
        ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
          FROM employee_schedule es 
       INNER JOIN  ${process.env.HRMS_DB_NAME}employees emp ON emp._id = es.employee_id_fk 
       INNER JOIN  ${process.env.HRMS_DB_NAME}plantilla_positions pp ON  pp.employee_id_fk = emp._id
       INNER JOIN custom_groups cg ON cg.custom_group_id = es.custom_group_id_fk 
       WHERE date_from=? AND date_to=? AND schedule_id_fk=? AND es.custom_group_id_fk = ?
       `,
      [dateFrom, dateTo, scheduleId, customGroupId]
    )) as {
      employeeId: string;
      fullName: string;
      positionTitle: string;
      assignment: string;
      companyId: string;
    }[];

    return assignedMembers;
  }

  async getCustomGroupUnassignedRankFileMember(employeeIds: string[]) {
    let unassignedEmployees;
    if (employeeIds.length === 0) {
      unassignedEmployees = await this.rawQuery(
        `
        SELECT 
          emp._id employeeId,
          emp.company_id companyId,
          ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) fullName,
          pp.position_title positionTitle,
          ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
        FROM ${process.env.HRMS_DB_NAME}employees emp INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON 
        emp._id = pp.employee_id_fk WHERE nature_of_appointment = 'casual' OR nature_of_appointment = 'permanent' 
        ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) ASC
      `
      );
    } else
      unassignedEmployees = await this.rawQuery(
        `
      SELECT 
        emp._id employeeId,
        emp.company_id companyId,
        ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) fullName,
        pp.position_title positionTitle,
        ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
      FROM ${process.env.HRMS_DB_NAME}employees emp INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON 
      emp._id = pp.employee_id_fk WHERE emp._id NOT IN (?) AND (nature_of_appointment = 'casual' OR nature_of_appointment = 'permanent') 
      ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) ASC
    `,
        [employeeIds]
      );
    return unassignedEmployees;
  }

  async getCustomUnassignedJobOrderCosMember(employeeIds: string[]) {
    let unassignedEmployees;
    if (employeeIds.length === 0) {
      unassignedEmployees = await this.rawQuery(
        `
        SELECT 
          emp._id employeeId,
          emp.company_id companyId,
          ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) fullName,
          pp.position_title positionTitle,
          ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
        FROM ${process.env.HRMS_DB_NAME}employees emp INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON 
        emp._id = pp.employee_id_fk WHERE nature_of_appointment = 'contract of service' OR nature_of_appointment = 'job order' 
        ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) ASC
      `
      );
    } else
      unassignedEmployees = await this.rawQuery(
        `
      SELECT 
        emp._id employeeId,
        emp.company_id companyId,
        ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) fullName,
        pp.position_title positionTitle,
        ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
      FROM ${process.env.HRMS_DB_NAME}employees emp INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON 
      emp._id = pp.employee_id_fk WHERE emp._id NOT IN (?) AND (nature_of_appointment = 'contract of service' OR nature_of_appointment = 'job order') 
      ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) ASC
    `,
        [employeeIds]
      );
    return unassignedEmployees;
  }

  async getCustomGroupAssignedMember(employeeIds: string[]) {
    let assignedEmployees;
    if (employeeIds.length === 0) return [];
    else
      assignedEmployees = await this.rawQuery(
        `
      SELECT 
        emp._id employeeId,
        emp.company_id companyId,
        ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) fullName,
        pp.position_title positionTitle,
        ${process.env.HRMS_DB_NAME}get_employee_assignment(emp._id) assignment 
      FROM ${process.env.HRMS_DB_NAME}employees emp INNER JOIN ${process.env.HRMS_DB_NAME}plantilla_positions pp ON 
      emp._id = pp.employee_id_fk WHERE emp._id IN (?) ORDER BY ${process.env.HRMS_DB_NAME}get_employee_fullname2(emp._id) ASC;
    `,
        [employeeIds]
      );

    return assignedEmployees;
  }

  async getCustomGroupMembers(customGroupId: string, unassigned: boolean, isRankFile?: boolean) {
    let assignedMembers;

    if (unassigned) {
      assignedMembers = (await this.crudService.findAll({
        find: { select: { employeeId: true } },
        onError: () => new NotFoundException(),
      })) as CustomGroupMembers[];

      const employeeIds = await Promise.all(
        assignedMembers.map(async (assignedMember) => {
          return assignedMember.employeeId;
        })
      );

      if (isRankFile) {
        return await this.getCustomGroupUnassignedRankFileMember(employeeIds);
      } else {
        return await this.getCustomUnassignedJobOrderCosMember(employeeIds);
      }
    } else {
      assignedMembers = (await this.crudService.findAll({
        find: { select: { employeeId: true }, where: { customGroupId: { id: customGroupId } } },
        onError: () => new NotFoundException(),
      })) as CustomGroupMembers[];
      const employeeIds = await Promise.all(
        assignedMembers.map(async (assignedMember) => {
          return assignedMember.employeeId;
        })
      );
      return await this.getCustomGroupAssignedMember(employeeIds);
    }
  }
}
