import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { MessagePattern, RpcError } from '../types';

export abstract class MicroserviceHelper {
  constructor(private readonly microserviceClient: ClientProxy) {}

  async send<TResult, TInput>(pattern: MessagePattern, data: TInput, onError?: (error: RpcError) => HttpException): Promise<TResult> {
    try {
      // send microservice request
      return await lastValueFrom(this.microserviceClient.send<TResult, TInput>(pattern, data).pipe(timeout(5000)));

      // catch any resulting error
    } catch (error) {
      // if onError callback is not specified, throw an error
      if (!onError) throw new Error(error);

      // otherwise, throw onError callback
      throw onError(error);
    }
  }
}
