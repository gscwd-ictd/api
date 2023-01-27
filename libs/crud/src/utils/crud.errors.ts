import { MyRpcException } from '@gscwd-api/microservices';
import { HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { ErrorOptions } from '../types';

export const throwRpc = (errorOptions: ErrorOptions) => {
  const { error, metadata } = errorOptions;

  if (error instanceof QueryFailedError) {
    return new MyRpcException({
      code: HttpStatus.BAD_REQUEST,
      details: error,
      message: {
        status: 400,
        error: `Query failed on ${metadata.name}`,
        details: error.driverError,
      },
    });
  }

  if (error instanceof EntityNotFoundError) {
    return new MyRpcException({
      code: HttpStatus.NOT_FOUND,
      details: error,
      message: {
        status: 404,
        error: error.name,
        details: `Cannot find entity of type ${metadata.name} with the given parameter.`,
      },
    });
  }

  if (error instanceof TypeORMError) {
    return new MyRpcException({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      details: error,
      message: {
        error: error.name,
        details: error.message,
      },
    });
  }
};
