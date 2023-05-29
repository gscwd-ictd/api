import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeSchedule, EmployeeScheduleDto } from '@gscwd-api/models';
import { EmployeeDetails, ScheduleType } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class EmployeeScheduleService extends CrudHelper<EmployeeSchedule> {
  constructor(
    private readonly crudService: CrudService<EmployeeSchedule>,
    private readonly client: MicroserviceClient,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  async addEmployeeSchedule(employeeScheduleDto: EmployeeScheduleDto) {
    //transaction
    const { restDays, ...restOfEmployeeSchedules } = employeeScheduleDto;
    const result = await this.dataSource.transaction(async (entityManager) => {
      const employeeSchedule = await this.crud().transact<EmployeeSchedule>(entityManager).create({
        dto: restOfEmployeeSchedules,
      });
      return employeeSchedule;
    });
    //1. Create Employee Schedule

    //2. Set Rest Days
    return result;
    // return await this.crudService.create({
    //   dto: employeeScheduleDto,
    //   onError: ({ error }) => {
    //     return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
    //   },
    // });
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
          timeIn2: string;
          timeOut: string;
          timeOut2: string;
          lunchIn: string;
          lunchIn2: string;
          lunchOut: string;
          lunchOut2: string;
          scheduleBase: string;
          restDaysNumbers: string;
          restDaysNames: string;
        }
      >(
        `SELECT 
        s.schedule_id id,
        s.name scheduleName, 
        s.schedule_type scheduleType, 
        time_format(s.time_in, '%h:%i %p') timeIn,
        s.time_in timeIn2,
        time_format(s.lunch_out, '%h:%i %p') lunchOut, 
        s.lunch_out lunchOut2,
        time_format(s.lunch_in, '%h:%i %p') lunchIn, 
        s.lunch_in lunchIn2, 
        time_format(s.time_out, '%h:%i %p') timeOut, 
        s.time_out timeOut2, 
        s.shift shift,
        s.schedule_base scheduleBase,
        GROUP_CONCAT(sr.rest_day SEPARATOR ', ') restDaysNumbers,
        GROUP_CONCAT(get_weekday((sr.rest_day - 1)) SEPARATOR ', ') restDaysNames 
    FROM employee_schedule es 
    INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
    LEFT JOIN schedule_rest_day sr ON s.schedule_id = sr.schedule_id_fk 
    WHERE employee_id_fk = ? GROUP BY s.schedule_id,es.created_at ORDER BY es.created_at DESC LIMIT 1`,
        [employeeId]
      )
    )[0];

    return { employeeName: employeeName.fullName, schedule: { ...schedule } };
  }
}
