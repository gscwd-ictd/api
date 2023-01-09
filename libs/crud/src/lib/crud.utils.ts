import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { FindManyOptions } from 'typeorm';

export const CRUD_SERVICE = 'CRUD_SERVICE';

export type ErrorResult = HttpException | RpcException;

export type FindAllOptions<T> = {
  pagination?: IPaginationOptions;
  search?: FindManyOptions<T>;
};
