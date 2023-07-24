import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, Observable, timeout } from 'rxjs';
import { MicroserviceRequest } from '../types/ms.types';
import { MS_CLIENT } from '../utils/ms-provider';

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
  async call<Pattern, Payload, Output>(request: MicroserviceRequest<Pattern, Payload>): Promise<Output | Observable<Output>> {
    // deconstruct payload object
    const { action, pattern, payload, onError } = request;

    try {
      // check if action type is emit
      if (action === 'emit') {
        // execute emit function
        this.client.emit(pattern, payload);

        // terminate the application
        return;
      }

      // execute send function
      //return await lastValueFrom(this.client.send<Output, Payload>(pattern, payload));
      return await lastValueFrom(this.client.send<Output, Payload>(pattern, payload).pipe(timeout(5000)));

      // catch any resulting error
    } catch (error) {
      // log the error in the console
      console.log(error);

      // if onError callback is not specified, throw an error
      if (!onError) throw new Error(error);

      // otherwise, throw onError callback
      throw onError(error);
    }
  }
}
