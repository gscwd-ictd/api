import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveApplicationDatesDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LeaveApplicationDates } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-application-dates/leave-application-dates.entity';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(private readonly crudService: CrudService<LeaveApplicationDates>) {
    super(crudService);
  }
}
