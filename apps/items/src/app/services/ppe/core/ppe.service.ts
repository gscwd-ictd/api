import { PpeDetailsView } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpeService extends CrudHelper<PpeDetailsView> {
  constructor(private readonly crudService: CrudService<PpeDetailsView>) {
    super(crudService);
  }
}
