/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from 'nestjs-typeorm-paginate';
import { DeepPartial, UpdateResult, DeleteResult } from 'typeorm';

export interface ICrudRoutes {
  /**
   * Post route for creating a new row in the database
   * @param data - the data to be created
   */
  create(data: any): Promise<any>;

  /**
   * Get route for finding all data in the table
   * @param page - page count for the resulting values
   * @param limit - how many rows to return
   */
  findAll(page?: number, limit?: number): Promise<Pagination<any>>;

  /**
   * Get route for finding a certain data in the table
   * @param id - unique identifier
   */
  findById(id: string | number): Promise<any>;

  /**
   * Put route for updating a data in the database
   * @param id - unique identifier of the data you want to update
   * @param data - the value to which the data will be updated to
   */
  update(id: string | number, data: DeepPartial<any>): Promise<UpdateResult>;

  /**
   * Delete route for removing a data in the database
   * @param id - unique identifier of the data you wish to delete
   */
  delete(id: string | number): Promise<DeleteResult>;
}
