import { IMS_MICROSERVICE, MicroserviceHelper } from '@gscwd-api/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MaterialCostService extends MicroserviceHelper {
  constructor(
    @Inject(IMS_MICROSERVICE)
    private readonly client: ClientProxy
  ) {
    super(client);
  }
}
