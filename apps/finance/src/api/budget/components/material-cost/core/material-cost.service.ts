import { MicroserviceClient } from '@gscwd-api/microservices';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialCostService {
  constructor(private readonly client: MicroserviceClient) {}
}
