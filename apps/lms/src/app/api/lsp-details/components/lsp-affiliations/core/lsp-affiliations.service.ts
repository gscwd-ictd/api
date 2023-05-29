import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAffiliationDto, LspAffiliation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class LspAffiliationsService extends CrudHelper<LspAffiliation> {
  constructor(private readonly crudService: CrudService<LspAffiliation>, private readonly datasource: DataSource) {
    super(crudService);
  }

  async addLspAffiliations(lspAffiliationDto: CreateLspAffiliationDto, entityManager: EntityManager) {
    const lspAffiliation = await this.crudService.transact<LspAffiliation>(entityManager).create({
      dto: lspAffiliationDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspAffiliation;
    return rest;
  }

  async deleteAllLspAffiliationsByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspAffiliation>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
