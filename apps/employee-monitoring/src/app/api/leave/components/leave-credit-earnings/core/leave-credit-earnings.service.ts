import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLeaveCreditEarningsDto, LeaveCreditEarnings, UpdateLeaveCreditEarningsDto } from '@gscwd-api/models';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LeaveCreditEarningsService extends CrudHelper<LeaveCreditEarnings> {
  constructor(private readonly crudService: CrudService<LeaveCreditEarnings>) {
    super(crudService);
  }

  async addLeaveCreditEarnings(leaveCreditEarningsDto: CreateLeaveCreditEarningsDto) {
    return await this.crudService.create({ dto: leaveCreditEarningsDto, onError: () => new InternalServerErrorException() });
  }

  async addLeaveCreditEarningsTransaction(leaveCreditEarningsDto: CreateLeaveCreditEarningsDto, entityManager: EntityManager) {
    return await this.crudService
      .transact<LeaveCreditEarnings>(entityManager)
      .create({ dto: leaveCreditEarningsDto, onError: () => new InternalServerErrorException() });
  }

  async updateLeaveCreditEarnings(leaveCreditEarningsDto: UpdateLeaveCreditEarningsDto) {
    const { id, ...rest } = leaveCreditEarningsDto;
    const updateResult = await this.crudService.update({
      dto: rest,

      updateBy: { id },
    });
    if (updateResult.affected > 0) return leaveCreditEarningsDto;
  }
}
