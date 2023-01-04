/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepPartial, UpdateResult, DeleteResult } from 'typeorm';

export interface ICrudRoutes {
  create(data: any): Promise<any>;

  findAll(query?: string | boolean | number): Promise<any[]>;

  findById(id: string | number, query?: string | boolean | number): Promise<any>;

  update(id: string | number, data: DeepPartial<any>): Promise<UpdateResult>;

  delete(id: string | number): Promise<DeleteResult>;
}
