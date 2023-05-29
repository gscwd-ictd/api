import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingType } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingTypesService extends CrudHelper<TrainingType> {
  constructor(private readonly crudService: CrudService<TrainingType>) {
    super(crudService);
  }
}
