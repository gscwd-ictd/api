import { FindAllOptions } from '@gscwd-api/crud';
import { FIND_ALL_SPECS, FIND_SPECS_BY_ID } from '@gscwd-api/utils';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller()
export class SpecificationMicroserviceController {
  constructor(private readonly service: SpecificationService) {}

  @MessagePattern(FIND_ALL_SPECS)
  async findAll(@Payload() options: FindAllOptions<ItemSpecification>) {
    return await this.service.getProvider().findAll(options);
  }

  @MessagePattern(FIND_SPECS_BY_ID)
  async findById(@Payload('id') id: string) {
    return await this.service.getProvider().findOneBy({ id }, () => new RpcException({ msg: 'Something went wrong!' }));
  }
}
