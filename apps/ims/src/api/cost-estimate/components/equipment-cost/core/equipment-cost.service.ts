import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { EquipmentCost } from '../data/equipment-cost.entity';

@Injectable()
export class EquipmentCostService extends CrudHelper<EquipmentCost> {
  constructor(private readonly crudService: CrudService<EquipmentCost>) {
    super(crudService);
  }
}
