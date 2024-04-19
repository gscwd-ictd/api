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
  Post,
  Query,
} from '@nestjs/common';
import { OtherTrainingsService } from './other-trainings.service';
import { CreateOtherTrainingDto, OtherTraining } from '@gscwd-api/models';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller({ version: '1', path: 'other/trainings' })
export class OtherTrainingsController {
  constructor(private readonly otherTrainingsService: OtherTrainingsService) {}

  /* find all other trainings */
  @Get()
  async findAllOtherTrainings(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<Pagination<OtherTraining> | OtherTraining[]> {
    return await this.otherTrainingsService.crud().findAll({
      pagination: { page, limit },
      onError: () => new InternalServerErrorException(),
    });
  }

  @Get(':id')
  async findOtherTrainingById(@Param('id') id: string) {
    return await this.otherTrainingsService.findOtherTrainingById(id);
  }

  /* insert other trainings */
  @Post()
  async createOtherTrainings(@Body() data: CreateOtherTrainingDto) {
    return await this.otherTrainingsService.createOtherTrainings(data);
  }

  /* remove other training by id */
  @Delete(':id')
  async deleteOtherTrainingById(@Param('id') id: string) {
    return await this.otherTrainingsService.crud().delete({
      deleteBy: {
        id: id,
      },
      softDelete: false,
      onError: () => new BadRequestException(),
    });
  }
}
