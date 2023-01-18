import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { MS_CLIENT } from '../constants';
import { RpcRequest } from '../utils';

/**
 * The microservice client which holds a connection string in order to connect
 * to a specified microservice host.
 */

@Injectable()
export class MicroserviceClient {
  constructor(
    @Inject(MS_CLIENT)
    private readonly client: ClientProxy
  ) {}

  /**
   * Send a message queue to execute a function (specified via pattern) in a listening microservice host.
   *
   * @param request The RPC request object which accepts pattern, payload, and an optional error callback function.
   *
   */
  async send<Pattern, Payload, Output>(request: RpcRequest<Pattern, Payload>): Promise<Output> {
    // deconstruct payload object
    const { pattern, payload, onError } = request;

    try {
      /**
       * send microservice request
       * transform the resulting value from a stream to a promise
       */
      return await lastValueFrom(this.client.send<Output, Payload>(pattern, payload).pipe(timeout(5000)));

      // catch any resulting error
    } catch (error) {
      // if onError callback is not specified, throw an error
      if (!onError) throw new Error(error);

      // otherwise, throw onError callback
      throw onError(error);
    }
  }
}
