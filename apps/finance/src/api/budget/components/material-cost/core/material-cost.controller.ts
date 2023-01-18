import { Controller } from '@nestjs/common';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController {
  constructor(private readonly service: MaterialCostService) {}
}
