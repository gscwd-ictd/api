import { HttpException } from '@nestjs/common';
import { RpcError } from './error';

export type MessagePattern = { msg: string };

export type RpcRequest<TInput extends object> = {
  target: MessagePattern | string;
  payload: TInput;
  onError?: (error: RpcError) => HttpException;
};
