import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LspDetails } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LspDetailsService extends CrudHelper<LspDetails> {
  constructor(private readonly crudService: CrudService<LspDetails>) {
    super(crudService);
  }
}
