import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveBenefitsDto, LeaveBenefits } from '@gscwd-api/models';

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
}
