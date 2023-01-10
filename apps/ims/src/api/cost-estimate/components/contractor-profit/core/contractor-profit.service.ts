import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ContractorProfit } from '../data/contractor-profit.entity';

@Injectable()
export class ContractorProfitService extends CrudHelper<ContractorProfit> {
  generate() {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly crudService: CrudService<ContractorProfit>) {
    super(crudService);
  }
}
