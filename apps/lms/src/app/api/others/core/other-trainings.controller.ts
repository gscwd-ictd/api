import { Controller } from '@nestjs/common';
import { OtherTrainingsService } from './other-trainings.service';

@Controller({ version: '1', path: 'training' })
export class OtherTrainingsController {
  constructor(private readonly otherTrainingsService: OtherTrainingsService) {}
}
