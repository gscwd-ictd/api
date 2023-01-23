import { RpcException } from '@nestjs/microservices';
import { RpcError } from '../types/ms.types';

export class MyRpcException extends RpcException {
  constructor(private readonly myError: RpcError) {
    super(myError);
  }
}
