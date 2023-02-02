import { CrudService } from '@gscwd-api/crud';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeaveBenefitsDto, LeaveBenefits } from '@gscwd-api/models';

@Injectable()
export class LeaveBenefitsService {
  constructor(private readonly crudService: CrudService<LeaveBenefits>) {}

  async createLeaveBenefits(leaveBenefitsDTO: CreateLeaveBenefitsDto) {
    return await this.crudService.create({
      dto: leaveBenefitsDTO,
      onError: ({ error }) => {
        console.log(error);
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
  }
}
