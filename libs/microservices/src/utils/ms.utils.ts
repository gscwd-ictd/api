import { HttpException } from '@nestjs/common';
import { RpcError } from './error';

// message pattern type
export type MessagePattern<T> = { msg: T };

// used for composing object with strongly typed string values
export type ObjectValues<T> = T[keyof T];

// the microservice request object
export type RpcRequest<T, K> = {
  target: K;
  payload: T;
  onError?: (error: RpcError) => HttpException;
};
