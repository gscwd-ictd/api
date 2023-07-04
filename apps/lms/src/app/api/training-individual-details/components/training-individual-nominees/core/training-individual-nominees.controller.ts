import { Controller } from '@nestjs/common';
import { TrainingIndividualNomineesService } from './training-individual-nominees.service';

@Controller({ version: '1', path: 'training-individual-nominees' })
export class TrainingIndividualNomineesController {
  constructor(private readonly trainingIndividualNomineesService: TrainingIndividualNomineesService) {}

  // @Post()
  // async create(@Body() data: CreateTrainingNomineeDto) {
  //   return await this.trainingNomineesService.addTrainingNominees(data);
  // }

  // @Get(':id')
  // async findAll(
  //   @Param('id') id: string,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ): Promise<Pagination<TrainingNominee> | TrainingNominee[]> {
  //   return await this.trainingNomineesService.crud().findAll({
  //     find: {
  //       trainingDistribution: { employeeId: id },
  //     },
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }
}
