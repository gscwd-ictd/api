import { FindAllOptions } from '@gscwd-api/crud';
import { MyRpcException, Specifications } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemSpecification } from '../data/specification.entity';
import { SpecificationService } from './specification.service';

@Controller()
export class SpecificationMicroserviceController {
  constructor(private readonly service: SpecificationService) {}

  @MessagePattern(Specifications.FIND_ALL)
  async findAll(@Payload() options: FindAllOptions<ItemSpecification>) {
    return await this.service.crud().findAll(options);
  }

  @MessagePattern(Specifications.FIND_BY_ID)
  async findById(@Payload() id: string) {
    return await this.service.crud().findOneBy({ id }, (error) => new MyRpcException({ code: 404, message: 'Not found', details: error }));
  }
}
