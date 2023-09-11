import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTrainingDetailsDto, TrainingDetails, UpdateTrainingDetailsDto } from '@gscwd-api/models';
import { TrainingDetailsService } from './training-details.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { LspType } from '@gscwd-api/utils';
import { FindAllTrainingDetailsInterceptor } from '../misc/interceptors/training-details-test.interceptor';

@Controller({ version: '1', path: 'training-details' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  // HR

  //post method for creating a training and distribution of slots
  @Post()
  async create(@Query('lsp-type') lspType: LspType, @Body() data: CreateTrainingDetailsDto) {
    return await this.trainingDetailsService.addTrainingDetails(lspType, data);
  }

  //@UseInterceptors(FindAllTrainingDetailsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.trainingDetailsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  //get training details by training id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<TrainingDetails> {
    return this.trainingDetailsService.getTrainingDetailsById(id);
  }

  // //get all nominees by training id
  // @Get(':id/nominees')
  // async findNomineeById(@Param('id') id: string) {
  //   return `training nominees by training id ${id}`;
  // }

  //patch method to update training details by training id
  @Patch()
  async update(@Body() data: UpdateTrainingDetailsDto): Promise<UpdateResult> {
    return this.trainingDetailsService.updateTrainingDetails(data);
  }

  //delete method to remove trainings by training id
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.trainingDetailsService.deleteTrainingDetails(id);
  }

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
