import { CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { LeaveBenefits } from 'libs/models/src/lib/databases/employee-monitoring/data/leave-benefits/leave-benefits.entity';

@Injectable()
export class LeaveBenefitsService {
  constructor(private readonly crudService: CrudService<LeaveBenefits>) {}
}
