import { MyRpcException, PpeDetailsViewPatterns } from '@gscwd-api/microservices';
import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PpeService } from './ppe.service';

@Controller()
export class PpeController {
  constructor(private readonly ppeService: PpeService) {}

  @MessagePattern(PpeDetailsViewPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.ppeService.crud().findAll({
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

  @MessagePattern(PpeDetailsViewPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.ppeService.crud().findOneBy({
      findBy: { specification_id: id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find ppe item.',
            details: error.message,
          },
        }),
    });
  }
}
