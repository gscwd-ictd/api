import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingNominee } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingNomineesService extends CrudHelper<TrainingNominee> {
  constructor(private readonly crudService: CrudService<TrainingNominee>) {
    super(crudService);
  }
}
