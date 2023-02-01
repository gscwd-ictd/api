import { CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LeaveApplicationDates } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-application-dates/leave-application-dates.entity';

@Injectable()
export class LeaveApplicationDatesService {
  constructor(private readonly crudService: CrudService<LeaveApplicationDates>) {}
}
