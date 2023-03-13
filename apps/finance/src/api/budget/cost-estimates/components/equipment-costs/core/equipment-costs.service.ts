import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { EquipmentCost } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EquipmentCostService extends CrudHelper<EquipmentCost> {
  constructor(private readonly crudService: CrudService<EquipmentCost>) {
    super(crudService);
  }
}
