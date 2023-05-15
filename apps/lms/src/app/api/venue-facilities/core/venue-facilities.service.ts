import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { VenueFacility } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VenueFacilitiesService extends CrudHelper<VenueFacility> {
  constructor(private readonly crudService: CrudService<VenueFacility>) {
    super(crudService);
  }
}
