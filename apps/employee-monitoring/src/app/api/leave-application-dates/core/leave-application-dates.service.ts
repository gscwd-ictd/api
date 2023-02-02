import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LeaveApplicationDates } from '@gscwd-api/models';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(private readonly crudService: CrudService<LeaveApplicationDates>) {
    super(crudService);
  }
}
