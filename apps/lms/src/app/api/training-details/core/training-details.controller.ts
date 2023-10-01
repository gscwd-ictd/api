import { Body, Controller, DefaultValuePipe, Get, InternalServerErrorException, ParseIntPipe, Post, Query } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { CreateTrainingExternalDto, CreateTrainingInternalDto, TrainingDetails } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'training-details' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  @Post('/internal')
  async createTrainingInternal(@Body() data: CreateTrainingInternalDto) {
    return await this.trainingDetailsService.addTrainingInternal(data);
  }

  @Post('/external')
  async createTrainingExternal(@Body() data: CreateTrainingExternalDto) {
    return await this.trainingDetailsService.addTrainingExternal(data);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { trainingSource: true },
        select: { id: true, courseTitle: true, trainingSource: { name: true }, trainingType: true },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  // // HR

  // //post method for creating a training and distribution of slots
  // @Post()
  // async create(@Query('lsp-type') lspType: LspType, @Body() data: CreateTrainingDetailsDto) {
  //   return await this.trainingDetailsService.addTrainingDetails(lspType, data);
  // }

  // //@UseInterceptors(FindAllTrainingDetailsInterceptor)
  // @Get()
  // async findAll(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  // ) {
  //   return await this.trainingDetailsService.crud().findAll({
  //     pagination: { page, limit },
  //     onError: () => new InternalServerErrorException(),
  //   });
  // }

  // //get training details by training id
  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<TrainingDetails> {
  //   return this.trainingDetailsService.getTrainingDetailsById(id);
  // }

  // // //get all nominees by training id
  // // @Get(':id/nominees')
  // // async findNomineeById(@Param('id') id: string) {
  // //   return `training nominees by training id ${id}`;
  // // }

  // //patch method to update training details by training id
  // @Patch()
  // async update(@Body() data: UpdateTrainingDetailsDto): Promise<UpdateResult> {
  //   return this.trainingDetailsService.updateTrainingDetails(data);
  // }

  // //delete method to remove trainings by training id
  // @Delete(':id')
  // async delete(@Param('id') id: string): Promise<DeleteResult> {
  //   return this.trainingDetailsService.deleteTrainingDetails(id);
  // }

  //Employee Portal

  // //get all training by supervisor id and status
  // @Get('/supervisor/:supervisor_id')
  // async findTrainingBySupervisorId(@Param('supervisor_id') id: string) {
  //   return `training supervisor id ${id}`;
  // }

  // //get all training by supervisor id and status
  // @Get(':id/supervisor/:supervisor_id')
  // async findTrainingNomineesByTrainingIdAndSupervisorId(@Param('id') id: string, @Param('supervisor_id') supervisor_id: string) {
  //   return `training id ${id} training supervisor id ${supervisor_id}`;
  // }
}
