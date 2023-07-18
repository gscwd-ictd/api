import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateLeaveBenefitsDto, LeaveBenefits, UpdateLeaveBenefitsDto } from '@gscwd-api/models';
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

  async deleteLeaveBenefit(leaveBenefitId: string) {
    const leaveBenefit = await this.crud().findOne({ find: { where: { id: leaveBenefitId } } });
    const appliedCount = (
      await this.rawQuery(`SELECT count(*) appliedCount FROM leave_application WHERE leave_benefits_id_fk=?`, [leaveBenefitId])
    )[0].appliedCount;
    if (appliedCount > 0) throw new HttpException('Leave Benefit is already used in leave application.', HttpStatus.BAD_REQUEST);

    const deleteResult = await this.crud().delete({ deleteBy: { id: leaveBenefitId }, softDelete: false });
    if (deleteResult.affected > 0) return leaveBenefit;
  }

  async updateLeaveBenefits(updateLeaveBenefitsDto: UpdateLeaveBenefitsDto) {
    const { id, ...rest } = updateLeaveBenefitsDto;
    const updateResult = await this.crudService.update({ dto: rest, updateBy: { id }, onError: () => new InternalServerErrorException() });
    if (updateResult.affected > 0) {
      return updateLeaveBenefitsDto;
    }
  }
}
