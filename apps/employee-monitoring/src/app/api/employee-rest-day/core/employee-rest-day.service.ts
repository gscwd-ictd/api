import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { EmployeeRestDay } from 'libs/models/src/lib/databases/employee-monitoring/data/employee-rest-day/employee-rest-day.entity';

@Injectable()
export class EmployeeRestDayService extends CrudHelper<EmployeeRestDay> {
  constructor(private readonly crudService: CrudService<EmployeeRestDay>) {
    super(crudService);
  }
}
