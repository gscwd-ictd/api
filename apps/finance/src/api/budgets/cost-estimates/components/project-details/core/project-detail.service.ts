import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ProjectDetails } from '..';

@Injectable()
export class ProjectDetailService extends CrudHelper<ProjectDetails> {
  constructor(private readonly crudService: CrudService<ProjectDetail>) {
    super(crudService);
  }
}
