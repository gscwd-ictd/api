import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveMonetization, CreateLeaveMonetizationDto } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LeaveMonetizationService extends CrudHelper<LeaveMonetization> {
  constructor(private readonly crudService: CrudService<LeaveMonetization>) {
    super(crudService);
  }

  async createLeaveMonetization(createLeaveMonetizationDto: CreateLeaveMonetizationDto) {
    return await this.crudService.create({ dto: createLeaveMonetizationDto, onError: () => new InternalServerErrorException() });
  }
}
