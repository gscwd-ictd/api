import { CrudHelper, CrudService, FindAllOptions } from '@gscwd-api/crud';
import { FIND_ALL_SPECS } from '@gscwd-api/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MaterialCost } from '../data/material-cost.entity';

@Injectable()
export class MaterialCostService extends CrudHelper<MaterialCost> {
  constructor(
    @Inject('IMS_SERVICE')
    private readonly client: ClientProxy,

    private readonly crudService: CrudService<MaterialCost>
  ) {
    super(crudService);
  }

  async findAll(options: FindAllOptions<unknown>) {
    return await lastValueFrom(this.client.send(FIND_ALL_SPECS, options));
  }
}
