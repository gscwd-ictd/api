import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveMonetization, CreateLeaveMonetizationDto, LeaveApplication } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LeaveMonetizationService extends CrudHelper<LeaveMonetization> {
  constructor(private readonly crudService: CrudService<LeaveMonetization>) {
    super(crudService);
  }

  async createLeaveMonetization(createLeaveMonetizationDto: CreateLeaveMonetizationDto, leaveApplicationId: LeaveApplication) {
    return await this.crudService.create({
      dto: { leaveApplicationId, ...createLeaveMonetizationDto },
      onError: () => new InternalServerErrorException(),
    });
  }
}