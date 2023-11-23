import { Body, Controller, Patch } from '@nestjs/common';
import { TrainingDetailsService } from '../../training-details/core/training-details.service';
import { SendTrainingExternalDto, SendTrainingInternalDto } from '@gscwd-api/models';

@Controller({ version: '1', path: 'training-notices' })
export class TrainingNoticesController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  // @Patch('internal')
  // async updateTrainingInternalById(@Body() data: SendTrainingInternalDto) {
  //   return await this.trainingDetailsService.sendTrainingInternal(data);
  // }

  // @Patch('external')
  // async updateTrainingExternalById(@Body() data: SendTrainingExternalDto) {
  //   return await this.trainingDetailsService.sendTrainingExternal(data);
  // }
}