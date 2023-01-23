import { ItemClassification } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassificationsService extends CrudHelper<ItemClassification> {
  constructor(private readonly crudService: CrudService<ItemClassification>) {
    super(crudService);
  }
}
