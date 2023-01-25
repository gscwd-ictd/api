import { PpeDetailsViewPatterns } from '@gscwd-api/microservices';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PpeService } from './ppe.service';

@Controller()
export class PpeController {
  constructor(private readonly ppeService: PpeService) {}

  @MessagePattern(PpeDetailsViewPatterns.FIND_ALL)
  async findAll(@Payload('page') page: number, @Payload('limit') limit: number) {
    return await this.ppeService.findAll(page, limit);
  }

  @MessagePattern(PpeDetailsViewPatterns.FIND_BY_ID)
  async findOneBy(@Payload('id') id: string) {
    return await this.ppeService.findOneBy(id);
  }
}
