import { ICrudRoutes } from '@gscwd-api/crud';
import { Controller } from '@nestjs/common';
import { ItemService } from '../../../../item/core/item.service';
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { UpdateResult, DeleteResult } from 'typeorm';
import { MaterialCostService } from './material-cost.service';

@Controller({ version: '1', path: 'budget/material-costs' })
export class MaterialCostController implements ICrudRoutes {
  constructor(private readonly materialCostService: MaterialCostService, private readonly itemService: ItemService) {}

  async create(data: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async findAll(page?: number, limit?: number): Promise<any[] | Pagination<any, IPaginationMeta>> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string | number): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async update(id: string | number, data: any): Promise<UpdateResult> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string | number): Promise<DeleteResult> {
    throw new Error('Method not implemented.');
  }
}
