import { Controller } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';

@Controller({ version: '1', path: 'leave-benefits' })
export class LeaveBenefitsController {
  constructor(private readonly leaveBenefitsService: LeaveBenefitsService) {}
}
