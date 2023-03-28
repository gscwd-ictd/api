import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { EmployeeSchedule, EmployeeScheduleDto } from '@gscwd-api/models';
import { ScheduleType } from '@gscwd-api/utils';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class EmployeeScheduleService extends CrudHelper<EmployeeSchedule> {
  constructor(private readonly crudService: CrudService<EmployeeSchedule>, private readonly client: MicroserviceClient) {
    super(crudService);
  }

  async addEmployeeSchedule(employeeScheduleDto: EmployeeScheduleDto) {
    return await this.crudService.create({
      dto: employeeScheduleDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async getEmployeeSchedule(employeeId: string) {
    const employeeName: any = await this.client.call<string, string, { fullName: string }>({
      action: 'send',
      payload: employeeId,
      pattern: 'get_employee_name',
      onError: (error) => new NotFoundException(error),
    });

    const schedule = (
      await this.rawQuery<
        string,
        {
          id: string;
          scheduleName: string;
          scheduleType: ScheduleType;
          timeIn: string;
          timeOut: string;
          lunchIn: string;
          lunchOut: string;
          restDaysNumbers: string;
          restDaysNames: string;
        }
      >(
        `SELECT 
        s.schedule_id id,
        s.name scheduleName, 
        s.schedule_type scheduleType, 
        time_format(s.time_in, '%h:%i %p') timeIn,
        time_format(s.lunch_out, '%h:%i %p') lunchOut, 
        time_format(s.lunch_in, '%h:%i %p') lunchIn, 
        time_format(s.time_out, '%h:%i %p') timeOut, 
        s.shift shift,
        GROUP_CONCAT(sr.rest_day SEPARATOR ', ') restDaysNumbers,
        GROUP_CONCAT(get_weekday((sr.rest_day - 1)) SEPARATOR ', ') restDaysNames 
    FROM employee_schedule es 
    INNER JOIN schedule s ON s.schedule_id = es.schedule_id_fk 
    INNER JOIN schedule_rest_day sr ON s.schedule_id = sr.schedule_id_fk 
    WHERE employee_id_fk = ? GROUP BY s.schedule_id,es.created_at ORDER BY es.created_at DESC LIMIT 1`,
        [employeeId]
      )
    )[0];
    //const { fullName } = employeeName
    return { employeeName: employeeName.fullName, schedule: { ...schedule } };
  }
}
