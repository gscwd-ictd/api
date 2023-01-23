import { PpeSpecification } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpeSpecificationsService extends CrudHelper<PpeSpecification> {
  constructor(private readonly crudService: CrudService<PpeSpecification>) {
    super(crudService);
  }
}
