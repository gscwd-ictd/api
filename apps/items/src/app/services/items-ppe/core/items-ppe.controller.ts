import { ItemPpeDetailsPatterns, MyRpcException } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsPpeService } from './items-ppe.service';

@Controller()
export class ItemsPpeController {
  constructor(private readonly itemsPpeService: ItemsPpeService) {}

  @MessagePattern(ItemPpeDetailsPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.itemsPpeService.crud().findAll({
      pagination: { page, limit },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          details: error,
          message: {
            error: 'Something went wrong.',
            details: error.message,
          },
        }),
    });
  }

  @MessagePattern(ItemPpeDetailsPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.itemsPpeService.crud().findOneBy({
      findBy: { specification_id: id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find item details.',
            details: error.message,
          },
        }),
    });
  }
}
