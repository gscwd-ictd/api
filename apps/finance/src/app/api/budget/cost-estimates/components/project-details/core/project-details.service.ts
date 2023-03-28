import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { ProjectDetails } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectDetailsService extends CrudHelper<ProjectDetails> {
  constructor(private readonly crudService: CrudService<ProjectDetails>) {
    super(crudService);
  }
}
