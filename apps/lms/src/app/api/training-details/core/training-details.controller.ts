import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTrainingDetailsDto, TrainingDetails, UpdateTrainingDetailsDto } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TrainingDetailsService } from './training-details.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TrainingDetailsInterceptor } from '../misc/interceptors/training-details.interceptor';
import { LspType } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'training-details' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  // HR

  //post method for creating a training and distribution of slots
  @Post()
  async create(@Query('lsp-type') lspType: LspType, @Body() data: CreateTrainingDetailsDto) {
    switch (lspType) {
      case LspType.INDIVIDUAL:
        return await this.trainingDetailsService.addTrainingLspIndividual(data);
      case LspType.ORGANIZATION:
        return await this.trainingDetailsService.addTrainingLspOrganization(data);
      default:
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  //get method to get all trainings relate to training sources
  @Get()
  @UseInterceptors(TrainingDetailsInterceptor)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { trainingSource: true },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          location: true,
          courseTitle: true,
          trainingStart: true,
          trainingEnd: true,
          numberOfHours: true,
          deadlineForSubmission: true,
          invitationUrl: true,
          numberOfParticipants: true,
          status: true,
          trainingSource: {
            id: true,
            name: true,
          },
        },
      },
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
    return this.trainingDetailsService.crud().delete({
      deleteBy: { id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
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
