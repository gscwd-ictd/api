/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepPartial, UpdateResult, DeleteResult } from 'typeorm';

export interface ICrudRoutes {
  create(data: any): Promise<any>;

  findAll(): Promise<any[]>;

  findById(id: string | number): Promise<any>;

  update(id: string | number, data: DeepPartial<any>): Promise<UpdateResult>;

  delete(id: string | number): Promise<DeleteResult>;
}
