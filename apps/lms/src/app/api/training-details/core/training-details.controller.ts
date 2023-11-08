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
import { FindTrainingDetailsInterceptor } from '../misc/interceptors';

@Controller({ version: '1', path: 'training-details' })
export class TrainingDetailsController {
  constructor(private readonly trainingDetailsService: TrainingDetailsService) {}

  @Post('internal')
  async createTrainingInternal(@Body() data: CreateTrainingInternalDto) {
    return await this.trainingDetailsService.addTrainingInternal(data);
  }

  @Post('external')
  async createTrainingExternal(@Body() data: CreateTrainingExternalDto) {
    return await this.trainingDetailsService.addTrainingExternal(data);
  }

  @UseInterceptors(FindTrainingDetailsInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe('1'), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number
  ): Promise<Pagination<TrainingDetails> | TrainingDetails[]> {
    return await this.trainingDetailsService.crud().findAll({
      find: {
        relations: { trainingSource: true, trainingDesign: true },
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
          trainingSource: { name: true },
          trainingType: true,
          trainingPreparationStatus: true,
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

  // microservices test
  @Get('supervisor/:id')
  async findTrainingRecommendedEmployeeBySupervisorId(@Param('id') id: string) {
    return await this.trainingDetailsService.findTrainingRecommendedEmployeeBySupervisorId(id);
  }
}
