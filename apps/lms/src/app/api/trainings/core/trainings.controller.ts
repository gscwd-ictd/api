import { ICrudRoutes } from '@gscwd-api/crud';
import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { TrainingsService } from './trainings.service';

@Controller({ version: '1', path: 'training-controller' })
export class TrainingsController implements ICrudRoutes {
  constructor(private readonly trainingsService: TrainingsService) {}

  @Post()
  async create(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Get()
  async findAll(page: number, limit: number): Promise<any[] | Pagination<any, IPaginationMeta>> {
    throw new Error('Method not implemented.');
  }

  @Get(':id')
  async findById(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  @Put(':id')
  async update(id: string, data: any): Promise<UpdateResult> {
    throw new Error('Method not implemented.');
  }

  @Delete(':id')
  async delete(id: string): Promise<DeleteResult> {
    throw new Error('Method not implemented.');
  }
}
