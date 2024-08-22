import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { LeaveMonetization, CreateLeaveMonetizationDto, LeaveApplication } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LeaveMonetizationService extends CrudHelper<LeaveMonetization> {
  constructor(private readonly crudService: CrudService<LeaveMonetization>) {
    super(crudService);
  }

  async createLeaveMonetization(
    transactionEntityManager: EntityManager,
    createLeaveMonetizationDto: CreateLeaveMonetizationDto,
    leaveApplicationId: LeaveApplication
  ) {
    return await this.crud()
      .transact<LeaveMonetization>(transactionEntityManager)
      .create({
        dto: { leaveApplicationId, ...createLeaveMonetizationDto },
        onError: ({ error }) => {
          console.log(error);
          return new InternalServerErrorException();
        },
      });
  }
}
