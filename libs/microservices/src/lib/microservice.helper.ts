import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { RpcRequest } from '../types/ms.types';

export abstract class MicroserviceHelper {
  constructor(private readonly microserviceClient: ClientProxy) {}

  async send<T, K extends object>(request: RpcRequest<K>): Promise<T> {
    // deconstruct payload object
    const { target, payload, onError } = request;

    try {
      /**
       * send microservice request
       * transform the resulting value from a stream to a promise
       */
      return await lastValueFrom(this.microserviceClient.send<T, K>(target, payload).pipe(timeout(5000)));

      // catch any resulting error
    } catch (error) {
      // if onError callback is not specified, throw an error
      if (!onError) throw new Error(error);

      // otherwise, throw onError callback
      throw onError(error);
    }
  }
}
