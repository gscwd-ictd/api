import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { MS_CLIENT } from '../constants';
import { RpcRequest } from '../utils';

@Injectable()
export class MicroserviceClient {
  constructor(
    @Inject(MS_CLIENT)
    private readonly client: ClientProxy
  ) {}

  async send<T, K, P>(request: RpcRequest<K, P>): Promise<T> {
    // deconstruct payload object
    const { target, payload, onError } = request;

    try {
      /**
       * send microservice request
       * transform the resulting value from a stream to a promise
       */
      return await lastValueFrom(this.client.send<T, K>(target, payload).pipe(timeout(5000)));

      // catch any resulting error
    } catch (error) {
      // if onError callback is not specified, throw an error
      if (!onError) throw new Error(error);

      // otherwise, throw onError callback
      throw onError(error);
    }
  }
}
