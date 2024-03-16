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
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateTrainingExternalDto,
  CreateTrainingInternalDto,
  SendTrainingNoticeExternalDto,
  SendTrainingNoticeInternalDto,
  TrainingDetails,
  UpdateTrainingExternalDto,
  UpdateTrainingInternalDto,
} from '@gscwd-api/models';
import { TrainingDetailsService } from './training-details.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FindAllTrainingInterceptor } from '../misc/interceptors';
import { TrainingStatus } from '@gscwd-api/utils';

@Controller({ version: '1', path: 'training' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  /* find all training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get()
  async findAllTraining(
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
        order: { updatedAt: 'DESC' },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all ongoing training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('ongoing')
  async findAllOngoingTraining(
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
        order: { updatedAt: 'DESC' },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all requirements submission training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('recent')
  async findAllRequirementsSubmissionTraining(
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
        order: { updatedAt: 'DESC' },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find all completed training */
  @UseInterceptors(FindAllTrainingInterceptor)
  @Get('history')
  async findAllCompletedTraining(
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
        order: { updatedAt: 'DESC' },
      },
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  /* find training by id */
  @Get(':id')
  async findTrainingDetailsById(@Param('id') id: string) {
    return await this.trainingDetailsService.findTrainingDetailsById(id);
  }

  /* insert training (source = internal) */
  @Post('internal')
  async createTrainingInternal(@Body() data: CreateTrainingInternalDto) {
    return await this.trainingDetailsService.createTrainingInternal(data);
  }

  /* insert training (source = external) */
  @Post('external')
  async createTrainingExternal(@Body() data: CreateTrainingExternalDto) {
    return await this.trainingDetailsService.createTrainingExternal(data);
  }

  /* edit training by id (source = internal) */
  @Put('internal')
  async updateTrainingInternalById(@Body() data: UpdateTrainingInternalDto) {
    return await this.trainingDetailsService.updateTrainingInternalById(data);
  }

  /* edit training by id (source = external) */
  @Put('external')
  async updateTrainingExternalById(@Body() data: UpdateTrainingExternalDto) {
    return await this.trainingDetailsService.updateTrainingExternalById(data);
  }

  /* remove training by id */
  @Delete(':id')
  async deleteTrainingById(@Param('id') id: string) {
    return await this.trainingDetailsService.crud().delete({
      deleteBy: { id: id },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }

  /* send a training notice to the manager to nominate (source = internal) */
  @Patch('notices/internal')
  async sendNoticeToManagersInternal(@Body() data: SendTrainingNoticeInternalDto) {
    return await this.trainingDetailsService.sendNoticeToManagersInternal(data);
  }

  /* send a training notice to the manager to nominate (source = external) */
  @Patch('notices/external')
  async sendNoticeToManagersExternal(@Body() data: SendTrainingNoticeExternalDto) {
    return await this.trainingDetailsService.sendNoticeToManagersExternal(data);
  }

  /* send a training notice to the managers to nominate */
  @Patch('notices/:id')
  async sendNoticeToManagers(@Param() id: string) {
    /* set status to on going nomination */
    const status = TrainingStatus.ON_GOING_NOMINATION;
    return await this.trainingDetailsService.updateTrainingStatusById(id, status);
  }
}
