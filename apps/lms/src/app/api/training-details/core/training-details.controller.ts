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
          location: true,
          trainingStart: true,
          trainingEnd: true,
          bucketFiles: true,
          source: { name: true },
          type: true,
          trainingPreparationStatus: true,
          status: true,
        },
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

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.trainingDetailsService.removeTrainingById(id);
  }
}
