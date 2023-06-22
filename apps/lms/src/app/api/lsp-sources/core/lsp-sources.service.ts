import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LspSource } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LspSourcesService extends CrudHelper<LspSource> {
  constructor(private readonly crudService: CrudService<LspSource>) {
    super(crudService);
  }
}
