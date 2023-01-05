import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ProjectDetail } from '../data/project-detail.entity';

@Injectable()
export class ProjectDetailService extends CrudHelper<ProjectDetail> {
  constructor(private readonly crudService: CrudService<ProjectDetail>) {
    super(crudService);
  }
}
