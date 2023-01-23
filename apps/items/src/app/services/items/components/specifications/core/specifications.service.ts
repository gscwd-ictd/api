import { ItemSpecification } from '@gscwd-api/app-entities';
import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpecificationsService extends CrudHelper<ItemSpecification> {
  constructor(private readonly crudService: CrudService<ItemSpecification>) {
    super(crudService);
  }
}
