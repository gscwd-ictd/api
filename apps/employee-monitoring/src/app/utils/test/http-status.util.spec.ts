import { NotFoundException } from '@nestjs/common';
import { httpStatusOf } from '../http-status.util';

describe('httpStatusOf', () => {
  it('HttpException -> its status', () => expect(httpStatusOf(new NotFoundException())).toBe(404));
  it('Error("[object Object]") from the microservice client -> 500', () =>
    expect(httpStatusOf(new Error({ status: 'error', message: 'Internal server error' } as never))).toBe(500));
  it('RPC error object { status: "error" } -> 500', () => expect(httpStatusOf({ status: 'error', message: 'x' })).toBe(500));
  it('undefined -> 500', () => expect(httpStatusOf(undefined)).toBe(500));
});
