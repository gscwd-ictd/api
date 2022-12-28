import { RpcException } from '@nestjs/microservices';

export const rpcError = (error: object | string) => {
  return new RpcException(error);
};
