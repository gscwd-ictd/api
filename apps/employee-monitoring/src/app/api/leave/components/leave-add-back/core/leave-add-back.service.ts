import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveAddBackDto, LeaveAddBack } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class LeaveAddBackService extends CrudHelper<LeaveAddBack> {
  constructor(private readonly crudService: CrudService<LeaveAddBack>) {
    super(crudService);
  }

  async addLeaveAddBack(createLeaveAddBackDto: CreateLeaveAddBackDto) {
    const leaveAddBack = await this.crudService.create({ dto: createLeaveAddBackDto, onError: () => new InternalServerErrorException() });
    return leaveAddBack;
  }
}
