import { MyRpcException } from '@gscwd-api/microservices';
import { HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export const CRUD_SERVICE = 'CRUD_SERVICE';

export type ErrorResult = HttpException | MyRpcException;

export type FindAllOptions<T> = {
  pagination?: IPaginationOptions;
  search?: FindManyOptions<T> | FindOptionsWhere<T>;
};
