import { PpeClassification } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PpeClassificationsService extends CrudHelper<PpeClassification> {
  constructor(private readonly crudService: CrudService<PpeClassification>) {
    super(crudService);
  }
}
