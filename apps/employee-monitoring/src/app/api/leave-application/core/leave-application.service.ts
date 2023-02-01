import { CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LeaveApplication } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-application/leave-application.entity';

@Injectable()
export class LeaveApplicationService {
  constructor(private readonly crudService: CrudService<LeaveApplication>) {}
}
