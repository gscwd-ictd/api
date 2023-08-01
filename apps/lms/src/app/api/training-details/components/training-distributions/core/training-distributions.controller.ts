import { Controller } from '@nestjs/common';
import { TrainingDistributionsService } from './training-distributions.service';

@Controller({ version: '1', path: 'training-distributions' })
export class TrainingDistributionsController {
  constructor(private readonly trainingDistributionsService: TrainingDistributionsService) {}

  // @Post()
  // async create(@Body() data: CreateTrainingDistributionDto): Promise<TrainingDistribution> {
  //   return await this.trainingDistributionsService.crud().create({
  //     dto: data,
  //     onError: () => new BadRequestException(),
  //   });
  // }

  // @Get()
  // async findAll(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ): Promise<Pagination<TrainingDistribution> | TrainingDistribution[]> {
  //   return await this.trainingDistributionsService.crud().findAll({
  //     find: { relations: { training: true }, select: { training: { id: true } } },
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }

  // @Get(':id')
  // async findTrainingByManagerIdAndStatus(
  //   @Param('id') id: string,
  //   @Query('status', new ParseEnumPipe(TrainingStatus)) status: TrainingStatus,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ): Promise<Pagination<TrainingDistribution> | TrainingDistribution[]> {
  //   return await this.trainingDistributionsService.crud().findAll({
  //     find: {
  //       relations: { training: true },
  //       select: { training: { id: true, status: true } },
  //       where: { employeeId: id, training: { status } },
  //     },
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }
}