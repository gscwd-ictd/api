import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseBoolPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { ItemCharacteristic } from '../../characteristic';
import { CreateItemClassificationDto } from '../data/classification.dto';
import { ItemClassification } from '../data/classification.entity';
import { ClassificationService } from './classification.service';

@Controller('items/classification')
export class ClassificationController implements ICrudRoutes {
  constructor(private readonly classificationService: ClassificationService) {}

  @Post()
  async create(@Body() data: CreateItemClassificationDto): Promise<ItemClassification> {
    return await this.classificationService.create(data, () => new BadRequestException());
  }

  @Get()
  async findAll(@Query('characteristic') characteristic: string): Promise<ItemClassification[]> {
    if (characteristic) return await this.classificationService.findAllClassification(characteristic);
    return await this.classificationService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Query('relations', ParseBoolPipe) relations: boolean): Promise<ItemClassification> {
    if (relations) return await this.classificationService.findClassificationWithRelations(id);
    return await this.classificationService.findOneBy({ id }, () => new NotFoundException());
  }

  @Patch(':id')
  async patchCharacteristic(@Param('id') id: string, @Body('characteristic') characteristic: ItemCharacteristic) {
    return await this.classificationService.update({ id }, { characteristic }, () => new BadRequestException());
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: ItemClassification): Promise<UpdateResult> {
    return await this.classificationService.update({ id }, data, () => new BadRequestException());
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.classificationService.delete({ id }, () => new BadRequestException());
  }
}
