import { ICrudRoutes } from '@gscwd-api/crud';
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTrainingDto, Training } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TrainingsService } from './trainings.service';

@Controller({ version: '1', path: 'trainings' })
export class TrainingsController {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  async create(@Body() data: CreateTrainingDto) {
    return await this.trainingsService.addTrainings(data);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<Training> | Training[]> {
    return await this.trainingsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  // @Get(':id')
  // async findById(@Param('id') id: string): Promise<TrainingType> {
  //   return this.trainingTypesService.crud().findOneBy({
  //     findBy: { id },
  //     onError: () => new NotFoundException(),
  //   });
  // }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() data: UpdateTrainingTypeDto): Promise<UpdateResult> {
  //   return this.trainingTypesService.crud().update({
  //     updateBy: { id },
  //     dto: data,
  //     onError: () => new BadRequestException(),
  //   });
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string): Promise<DeleteResult> {
  //   return this.trainingTypesService.crud().delete({
  //     deleteBy: { id },
  //     softDelete: false,
  //     onError: () => new BadRequestException(),
  //   });
  // }
}
