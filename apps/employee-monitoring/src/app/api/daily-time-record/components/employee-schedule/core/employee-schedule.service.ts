import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeSchedule, CreateEmployeeScheduleDto, CreateEmployeeScheduleByGroupDto } from '@gscwd-api/models';
import { EmployeeDetails, ScheduleType } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { CustomGroupMembersService } from '../../../../custom-groups/components/custom-group-members/core/custom-group-members.service';
import { EmployeeRestDayService } from '../components/employee-rest-day/core/employee-rest-day.service';

@Injectable()
export class EmployeeScheduleService extends CrudHelper<EmployeeSchedule> {
  constructor(
    private readonly crudService: CrudService<EmployeeSchedule>,
    private readonly employeeRestDayService: EmployeeRestDayService,
    private readonly client: MicroserviceClient,
    private readonly customGroupMembersService: CustomGroupMembersService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addEmployeeSchedule(employeeScheduleDto: CreateEmployeeScheduleDto) {
    //transaction
    const { restDays, ...restOfEmployeeSchedules } = employeeScheduleDto;
    const result = await this.dataSource.transaction(async (entityManager) => {
      const employeeSchedule = await this.crud().transact<EmployeeSchedule>(entityManager).create({
        dto: restOfEmployeeSchedules,
      });
      const { dateFrom, dateTo, employeeId, scheduleId } = restOfEmployeeSchedules;
      //1. Create Employee Schedule
      const employeeRestDay = await this.employeeRestDayService.addEmployeeRestDayTransaction(
        {
          employeeId,
          dateFrom,
          dateTo,
          restDays,
        },
        entityManager
      );
      return { ...employeeSchedule, employeeRestDay };
    });
    //return employeeRestDay;
    //2. Set Rest Days
    return result;
  }

  async addEmployeeScheduleByGroup(employeeScheduleByGroupDto: CreateEmployeeScheduleByGroupDto) {
    const { dateFrom, dateTo, scheduleId, employees } = employeeScheduleByGroupDto;
    const employeeSchedules = await Promise.all(
      employees.map(async (employee) => {
        return await this.addEmployeeSchedule({ dateFrom, dateTo, scheduleId, employeeId: employee.employeeId, restDays: employee.restDays });
      })
    );
    return employeeSchedules;
  }

  async getEmployeeScheduleByCompanyId(companyId: string) {
    const employeeDetails = (await this.client.call({
      action: 'send',
      payload: companyId,
      pattern: 'get_employee_details_by_company_id',
      onError: (error) => new NotFoundException(error),
    })) as EmployeeDetails;
    return employeeDetails;
  }

  async getEmployeeSchedule(employeeId: string) {
    const employeeName = (await this.client.call<string, string, { fullName: string }>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_name',
      onError: (error) => new NotFoundException(error),
    })) as { fullName: string };

    const schedule = (
      await this.rawQuery<
        string,
        {
          id: string;
          scheduleName: string;
          scheduleType: ScheduleType;
          timeIn: string;
          lunchOut: string;
          lunchIn: string;
          timeOut: string;
          scheduleBase: string;
          restDaysNumbers: string;
          restDaysNames: string;
        }
      >(
        `SELECT 
        s.schedule_id id,
        s.name scheduleName, 
        s.schedule_type scheduleType, 
        s.time_in timeIn,
        s.lunch_out lunchOut,
        s.lunch_in lunchIn, 
        s.time_out timeOut, 
        s.shift shift,
        s.schedule_base scheduleBase,
        GROUP_CONCAT(emrs.rest_day SEPARATOR ', ') restDaysNumbers,
        GROUP_CONCAT(get_weekday((emrs.rest_day - 1)) SEPARATOR ', ') restDaysNames 
    FROM employee_schedule es 
    INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
    LEFT JOIN employee_rest_day emr ON emr.employee_id_fk = es.employee_id_fk 
    INNER JOIN employee_rest_days emrs ON emr.employee_rest_day_id = emrs.employee_rest_day_id_fk  
    WHERE emr.employee_id_fk = ? GROUP BY s.schedule_id,es.created_at ORDER BY es.created_at DESC LIMIT 1`,
        [employeeId]
      )
    )[0];

    return { employeeName: employeeName.fullName, schedule: { ...schedule } };
  }

  async getEmployeeScheduleByGroupId(customGroupId: string) {
    return customGroupId;
  }
}
