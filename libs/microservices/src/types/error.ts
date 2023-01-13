import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export type RpcError = {
  message: string;
  code: HttpStatus;
  details?: string | Error;
};

export class MyRpcException extends RpcException {
  constructor(private readonly myError: RpcError) {
    super(myError);
  }
}
