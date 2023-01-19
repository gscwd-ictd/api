import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateImsLogDto } from '../data/ims.dto';
import { ImsService } from './ims.service';

@Controller()
export class ImsController {
  constructor(private readonly imsService: ImsService) {}

  @EventPattern('create_ims_log')
  async create(@Payload() data: CreateImsLogDto) {
    console.log(data);
    //return await this.imsService.crud().create({ dto: data });
  }
}
