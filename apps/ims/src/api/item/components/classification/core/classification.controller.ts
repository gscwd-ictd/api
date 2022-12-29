import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemClassificationDto } from '../data/classification.dto';
import { ItemClassification } from '../data/classification.entity';
import { ClassificationService } from './classification.service';

@Controller('item/classification')
export class ClassificationController implements ICrudRoutes {
  constructor(private readonly classificationService: ClassificationService) {}

  @Post()
  async create(@Body() data: CreateItemClassificationDto): Promise<ItemClassification> {
    return await this.classificationService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(): Promise<ItemClassification[]> {
    return await this.classificationService.findAll();
  }

  @Get(':id')
  async findById(@Param() id: string): Promise<ItemClassification> {
    return await this.classificationService.findOneBy({ id }, () => new NotFoundException());
  }

  @Put(':id')
  async update(@Param() id: string, @Body() data: ItemClassification): Promise<UpdateResult> {
    return await this.classificationService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param() id: string): Promise<DeleteResult> {
    return await this.classificationService.delete({ id }, () => new BadRequestException());
  }
}
