import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingDistribution } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingDistributionsService extends CrudHelper<TrainingDistribution> {
  constructor(private readonly crudService: CrudService<TrainingDistribution>) {
    super(crudService);
  }
}
