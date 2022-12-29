import { ICrudRoutes } from '@gscwd-api/crud';
import { BadRequestException, Controller, NotFoundException } from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CreateItemSpecificationDto } from '../data/specification.dto';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller('item/specifications')
export class SpecificationController implements ICrudRoutes {
  constructor(private readonly specificationService: SpecificationService) {}

  async create(data: CreateItemSpecificationDto): Promise<ItemSpecification> {
    return await this.specificationService.create(data, () => new BadRequestException());
  }

  async findAll(): Promise<ItemSpecification[]> {
    return await this.specificationService.findAll();
  }

  async findById(id: string): Promise<ItemSpecification> {
    return await this.specificationService.findOneBy({ id }, () => new NotFoundException());
  }

  async update(id: string, data: unknown): Promise<UpdateResult> {
    return await this.specificationService.update({ id }, data, () => new BadRequestException());
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.specificationService.delete({ id }, () => new BadRequestException());
  }
}
