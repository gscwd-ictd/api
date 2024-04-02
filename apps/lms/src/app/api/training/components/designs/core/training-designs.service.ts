import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { TrainingDesign } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingDesignsService extends CrudHelper<TrainingDesign> {
  constructor(private readonly crudService: CrudService<TrainingDesign>) {
    super(crudService);
  }
}
