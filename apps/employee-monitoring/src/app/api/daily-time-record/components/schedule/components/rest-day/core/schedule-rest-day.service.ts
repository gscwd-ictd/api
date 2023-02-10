import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ScheduleRestDay } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleRestDayService extends CrudHelper<ScheduleRestDay> {
  constructor(private readonly crudService: CrudService<ScheduleRestDay>) {
    super(crudService);
  }
}
