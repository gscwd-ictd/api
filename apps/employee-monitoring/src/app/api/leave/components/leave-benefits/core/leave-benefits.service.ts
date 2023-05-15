import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveBenefitsDto, LeaveBenefits } from '@gscwd-api/models';
import { LeaveTypes } from '@gscwd-api/utils';

@Injectable()
export class LeaveBenefitsService extends CrudHelper<LeaveBenefits> {
  constructor(private readonly crudService: CrudService<LeaveBenefits>) {
    super(crudService);
  }

  async createLeaveBenefits(leaveBenefitsDTO: CreateLeaveBenefitsDto) {
    return await this.crudService.create({
      dto: leaveBenefitsDTO,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }

  async getLeaveBenefitsByType(leaveType: LeaveTypes) {
    if (leaveType)
      return await this.crud().findAll({
        find: {
          select: { id: true, leaveName: true, accumulatedCredits: true, canBeCarriedOver: true, creditDistribution: true, isMonetizable: true },
          where: { leaveType },
          order: { leaveName: 'ASC' },
        },
      });
    return await this.crud().findAll({
      find: {
        select: {
          id: true,
          leaveName: true,
          accumulatedCredits: true,
          canBeCarriedOver: true,
          creditDistribution: true,
          isMonetizable: true,
          leaveType: true,
        },
        order: { leaveName: 'ASC' },
      },
    });
  }
}
