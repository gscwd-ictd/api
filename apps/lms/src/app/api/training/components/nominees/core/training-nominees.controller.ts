import { Controller } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';

@Controller({ version: '1', path: 'training-nominees' })
export class TrainingNomineesController {
  constructor(private readonly trainingNomineesService: TrainingNomineesService) {}

  /*  // create training nominee batching
  @Post('batch')
  async createTrainingNomineeBatch(@Body() data: CreateTrainingBatchDto) {
    return await this.trainingNomineesService.createTrainingNomineeBatch(data);
  }

  // update training nominee batching
  @Patch('batch')
  async updateTrainingNomineeBatch(@Body() data: UpdateTrainingBatchDto) {
    return await this.trainingNomineesService.updateTrainingNomineeBatch(data);
  }

  // find all accepted training batch nominee by training id (nominee type = nominee & preparation status = on going nomination)
  @Get(':id/batch')
  async findAllBatchByTrainingId(@Param('id') trainingId: string) {
    return await this.trainingNomineesService.findAllBatchByTrainingId(trainingId);
  }


*/
}
