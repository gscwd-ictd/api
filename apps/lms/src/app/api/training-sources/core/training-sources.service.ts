import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingSource } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingSourcesService extends CrudHelper<TrainingSource> {
  constructor(private readonly crudService: CrudService<TrainingSource>) {
    super(crudService);
  }
}
