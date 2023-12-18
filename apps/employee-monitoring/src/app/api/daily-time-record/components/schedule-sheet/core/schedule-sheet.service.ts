import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ScheduleSheetView } from '@gscwd-api/models';
import { ScheduleBase } from '@gscwd-api/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleSheetService extends CrudHelper<ScheduleSheetView> {
  constructor(private readonly crudService: CrudService<ScheduleSheetView>) {
    super(crudService);
  }

  async getAllScheduleSheet(scheduleBase: ScheduleBase) {
    return await this.crud().findAll({ find: { order: { customGroupName: 'ASC' }, where: { scheduleBase } } });
  }
}
