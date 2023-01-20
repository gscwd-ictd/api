import { MyRpcException } from '@gscwd-api/microservices';
import { HttpException } from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, SaveOptions } from 'typeorm';

export const CRUD_SERVICE = 'CRUD_SERVICE';

export type ErrorResult = HttpException | MyRpcException;

export type CrudOptions = {
  onError?: (error: Error) => ErrorResult;
};

export type CrudCreateOptions<T> = CrudOptions & {
  dto: DeepPartial<T>;
  saveOptions?: SaveOptions;
};

export type CrudFindAllOptions<T> = CrudOptions & {
  pagination?: IPaginationOptions;
  find?: FindManyOptions<T> | FindOptionsWhere<T>;
};

export type CrudFindOneByOptions<T> = CrudOptions & {
  findBy: FindOptionsWhere<T> | FindOptionsWhere<T>[];
};

export type CrudFindOneOptions<T> = CrudOptions & {
  find: FindOneOptions<T>;
};

export type CrudUpdateOptions<T> = CrudOptions & {
  updateBy: FindOptionsWhere<T>;
  dto: DeepPartial<T>;
};

export type CrudDeleteOptions<T> = CrudOptions & {
  deleteBy: FindOptionsWhere<T>;
  softDelete?: boolean;
};
