import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import {
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  TrainingDetails,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
} from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TrainingInterceptor } from '../misc/interceptors';
import { TrainingStatus } from '@gscwd-api/utils';
import { AuthGuard } from '../../../../guards';

@Controller({ version: '1', path: 'training-details' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  @Post('internal')
  async createTrainingInternal(@Body() data: CreateTrainingInternalDto) {
    return await this.trainingDetailsService.createTrainingInternal(data);
  }

  @Post('external')
  async createTrainingExternal(@Body() data: CreateTrainingExternalDto) {
    return await this.trainingDetailsService.createTrainingExternal(data);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(TrainingInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { source: true, trainingDesign: true },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: { courseTitle: true },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          bucketFiles: true,
          source: { name: true },
          type: true,
          status: true,
        },
        order: {
          updatedAt: 'DESC',
        },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @UseInterceptors(TrainingInterceptor)
  @Get('ongoing')
  async findAllOngoing(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { source: true, trainingDesign: true },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: { courseTitle: true },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          bucketFiles: true,
          source: { name: true },
          type: true,
          status: true,
        },
        where: { status: TrainingStatus.ON_GOING_TRAINING },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @UseInterceptors(TrainingInterceptor)
  @Get('recents')
  async findAllRequirementsSubmission(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { source: true, trainingDesign: true },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: { courseTitle: true },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          bucketFiles: true,
          source: { name: true },
          type: true,
          status: true,
        },
        where: { status: TrainingStatus.REQUIREMENTS_SUBMISSION },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @UseInterceptors(TrainingInterceptor)
  @Get('history')
  async findAllCompleted(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { source: true, trainingDesign: true },
        select: {
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          id: true,
          trainingDesign: { courseTitle: true },
          courseTitle: true,
          numberOfParticipants: true,
          location: true,
          trainingStart: true,
          trainingEnd: true,
          bucketFiles: true,
          source: { name: true },
          type: true,
          status: true,
        },
        where: { status: TrainingStatus.COMPLETED },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findTrainingById(@Param('id') id: string) {
    return await this.trainingDetailsService.findTrainingById(id);
  }

  @Put('internal')
  async updateTrainingInternalById(@Body() data: UpdateTrainingInternalDto) {
    return await this.trainingDetailsService.updateTrainingInternalById(data);
  }

  @Put('external')
  async updateTrainingExternalById(@Body() data: UpdateTrainingExternalDto) {
    return await this.trainingDetailsService.updateTrainingExternalById(data);
  }

  @Put('done/:id')
  async updateTrainingToDone(@Param('id') id: string) {
    return await this.trainingDetailsService.updateTrainingToDone(id);
  }

  @Put('on-going/:id')
  async updateTrainingToOnGoing(@Param('id') id: string) {
    return await this.trainingDetailsService.updateTrainingToOnGoing(id);
  }

  @Put('requirements-submission/:id')
  async updateTrainingToForSubmission(@Param('id') id: string) {
    return await this.trainingDetailsService.updateTrainingToForSubmission(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.trainingDetailsService.removeTrainingById(id);
  }
}
