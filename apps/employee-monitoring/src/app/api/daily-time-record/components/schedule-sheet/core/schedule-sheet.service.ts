import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ScheduleSheetView } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScheduleSheetService extends CrudHelper<ScheduleSheetView> {
  constructor(private readonly crudService: CrudService<ScheduleSheetView>) {
    super(crudService);
  }

  async getAllScheduleSheet() {
    return await this.crud().findAll({ find: { order: { customGroupName: 'ASC' } } });
  }
}
