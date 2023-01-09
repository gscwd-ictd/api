/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, UpdateResult, DeleteResult } from 'typeorm';

export interface ICrudRoutes {
  create(data: any): Promise<any>;

  findAll(page?: number, limit?: number): Promise<Pagination<any>>;

  findById(id: string | number): Promise<any>;

  update(id: string | number, data: DeepPartial<any>): Promise<UpdateResult>;

  delete(id: string | number): Promise<DeleteResult>;
}
