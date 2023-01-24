import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ImsLogs } from '../data/ims.entity';

@Injectable()
export class ImsService extends CrudHelper<ImsLogs> {
  constructor(private readonly crudService: CrudService<ImsLogs>) {
    super(crudService);
  }
}
