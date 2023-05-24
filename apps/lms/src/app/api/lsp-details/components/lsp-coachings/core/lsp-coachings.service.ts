import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCoachingDto, LspCoaching } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCoachingsService extends CrudHelper<LspCoaching> {
  constructor(private readonly crudService: CrudService<LspCoaching>) {
    super(crudService);
  }

  async addLspCoachings(lspCoachingDto: CreateLspCoachingDto, entityManager: EntityManager) {
    const lspCoaching = await this.crudService.transact<LspCoaching>(entityManager).create({
      dto: lspCoachingDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspCoaching;
    return rest;
  }

  async deleteAllLspCoachingssByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspCoaching>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
