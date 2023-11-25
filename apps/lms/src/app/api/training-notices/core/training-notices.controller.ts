import { Body, Controller, Patch } from '@nestjs/common';
import { SendTrainingExternalDto, SendTrainingInternalDto } from '@gscwd-api/models';
import { TrainingNoticesService } from './training-notices.service';

@Controller({ version: '1', path: 'training-notices' })
export class TrainingNoticesController {
  constructor(private readonly trainingNoticesService: TrainingNoticesService) {}

  @Patch('internal')
  async updateTrainingInternalById(@Body() data: SendTrainingInternalDto) {
    return await this.trainingNoticesService.sendTrainingInternal(data);
  }

  @Patch('external')
  async updateTrainingExternalById(@Body() data: SendTrainingExternalDto) {
    return await this.trainingNoticesService.sendTrainingExternal(data);
  }
}
