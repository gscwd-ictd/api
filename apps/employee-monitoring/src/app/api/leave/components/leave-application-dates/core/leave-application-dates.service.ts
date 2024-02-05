import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveApplicationDatesDto, LeaveApplicationDates, LeaveDateCancellationDto } from '@gscwd-api/models';
import { EntityManager } from 'typeorm';

@Injectable()
export class LeaveApplicationDatesService extends CrudHelper<LeaveApplicationDates> {
  constructor(private readonly crudService: CrudService<LeaveApplicationDates>) {
    super(crudService);
  }

  async createApplicationDatesTransaction(transactionEntityManager: EntityManager, createLeaveApplicationDatesDto: CreateLeaveApplicationDatesDto) {
    return await this.crudService.transact<LeaveApplicationDates>(transactionEntityManager).create({
      dto: createLeaveApplicationDatesDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async cancelLeaveDateTransaction(transactionEntityManager: EntityManager, leaveDateCancellationDto: LeaveDateCancellationDto) {
    const { leaveApplicationId, leaveDates, status } = leaveDateCancellationDto;

    //cancellation
    const cancelledLeaveDates = await Promise.all(
      leaveDates.map(async (leaveDate) => {
        return await this.crudService
          .transact<LeaveApplicationDates>(transactionEntityManager)
          .update({ dto: { status }, updateBy: { leaveApplicationId, leaveDate } });
      })
    );

    return cancelledLeaveDates;
  }
}
