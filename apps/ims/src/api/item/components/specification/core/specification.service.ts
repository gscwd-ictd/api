import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ItemSpecification } from '../data/specification.entity';

@Injectable()
export class SpecificationService extends CrudHelper<ItemSpecification> {
  constructor(private readonly crudService: CrudService<ItemSpecification>) {
    super(crudService);
  }
}
