import { HttpException } from '@nestjs/common';
import { RpcError } from './error';

// message pattern type
export type MessagePattern<T> = { msg: T };

// used for composing object with strongly typed string values
//export type ObjectValues<T> = T[keyof T];

/**
 * Microservice request object
 *
 * @param action Defines whether microservice request is event based or message based.
 *
 * @param pattern A microservice channel to route the request to its host function.
 * This pattern should also reside in the listener (in this case, the host),
 * to call the appropriate function.
 *
 * @param payload Input data that the called function needs to process the requested function.
 *
 * @param onError A callback function in case an error in the request happens.
 *
 */
export type MicroserviceRequest<T, K> = {
  action: 'send' | 'emit';
  pattern: T;
  payload: K;
  onError?: (error: RpcError) => HttpException;
};
