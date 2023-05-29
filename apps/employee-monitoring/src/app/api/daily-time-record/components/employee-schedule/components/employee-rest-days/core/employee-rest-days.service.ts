import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { EmployeeRestDays } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeRestDaysService extends CrudHelper<EmployeeRestDays> {
  constructor(private readonly crudService: CrudService<EmployeeRestDays>) {
    super(crudService);
  }

  async updateEmployeeRestDays() {}

  async addEmployeeRestDays() {}
}
