import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { OvertimeEmployee } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OvertimeEmployeeService extends CrudHelper<OvertimeEmployee> {
  constructor(private readonly crudService: CrudService<OvertimeEmployee>) {
    super(crudService);
  }
}
