import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAwardDto, LspAward } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAwardsService extends CrudHelper<LspAward> {
  constructor(private readonly crudService: CrudService<LspAward>) {
    super(crudService);
  }

  async addLspAwards(lspAwardDto: CreateLspAwardDto, entityManager: EntityManager) {
    const lspAward = await this.crudService.transact<LspAward>(entityManager).create({
      dto: lspAwardDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspAward;
    return rest;
  }

  async deleteAllLspAwardsByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspAward>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
