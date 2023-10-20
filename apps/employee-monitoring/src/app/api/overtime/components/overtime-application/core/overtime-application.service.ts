import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOvertimeApplicationDto, OvertimeApplication } from '@gscwd-api/models';
import { OvertimeStatus } from '@gscwd-api/utils';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class OvertimeApplicationService extends CrudHelper<OvertimeApplication> {
  constructor(private readonly crudService: CrudService<OvertimeApplication>, private readonly dataSource: DataSource) {
    super(crudService);
  }
  async createOvertimeApplication(createOvertimeApplicationDto: CreateOvertimeApplicationDto, entityManager: EntityManager) {
    return await this.crudService.transact<OvertimeApplication>(entityManager).create({
      dto: createOvertimeApplicationDto,
      onError: () => new InternalServerErrorException(),
    });
  }

  async getOvertimeApplicationsByEmployeeIds(employeeIds: string[]) {
    //!TODO INVESTIGATE LATER

    const employees = (await this.rawQuery(
      `
        SELECT DISTINCT overtime_application_id overtimeApplicationId, ois.employee_id_fk employeeId, planned_date plannedDate, estimated_hours estimatedHours, purpose, oa.status status,oapp.remarks remarks 
          FROM overtime_application oa 
        INNER JOIN overtime_employee oe ON oa.overtime_application_id = oe.overtime_application_id_fk 
        INNER JOIN overtime_approval oapp ON oapp.overtime_application_id_fk = oa.overtime_application_id
        INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
        WHERE oe.employee_id_fk IN (?) ORDER BY planned_date DESC;
    `,
      [employeeIds]
    )) as {
      overtimeApplicationId: string;
      employeeId: string;
      plannedDate: string;
      estimatedHours: string;
      purpose: string;
      status: string;
    }[];

    return employees;
  }

  async getOvertimeApplicationsByEmployeeIdsByStatus(employeeIds: string[], status: OvertimeStatus) {
    //!TODO INVESTIGATE LATER

    const employees = (await this.rawQuery(
      `
        SELECT DISTINCT overtime_application_id overtimeApplicationId, ois.employee_id_fk employeeId, planned_date plannedDate, estimated_hours estimatedHours, purpose, oa.status status,oapp.remarks remarks 
          FROM overtime_application oa 
        INNER JOIN overtime_employee oe ON oa.overtime_application_id = oe.overtime_application_id_fk 
        INNER JOIN overtime_approval oapp ON oapp.overtime_application_id_fk = oa.overtime_application_id
        INNER JOIN overtime_immediate_supervisor ois ON ois.overtime_immediate_supervisor_id = oa.overtime_immediate_supervisor_id_fk 
        WHERE oe.employee_id_fk IN (?) AND oa.status = ? ORDER BY planned_date ASC;
    `,
      [employeeIds, status]
    )) as {
      overtimeApplicationId: string;
      employeeId: string;
      plannedDate: string;
      estimatedHours: string;
      purpose: string;
      status: string;
    }[];

    return employees;
  }
}
