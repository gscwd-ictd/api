import { HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const CRUD_SERVICE = 'CRUD_SERVICE';

export type ErrorResult = HttpException | RpcException;
