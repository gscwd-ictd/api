import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { VenueDetails } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VenueDetailsService extends CrudHelper<VenueDetails> {
  constructor(private readonly crudService: CrudService<VenueDetails>) {
    super(crudService);
  }
}
