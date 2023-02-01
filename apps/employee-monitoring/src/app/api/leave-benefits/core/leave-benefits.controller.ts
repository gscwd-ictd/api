import { Controller } from '@nestjs/common';
import { LeaveBenefitsService } from './leave-benefits.service';

@Controller('leave-benefits')
export class LeaveBenefitsController {
  constructor(private readonly leaveBenefitsService: LeaveBenefitsService) {}
}
