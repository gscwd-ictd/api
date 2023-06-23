import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualCoachingDto, LspIndividualCoaching } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualCoachingsService extends CrudHelper<LspIndividualCoaching> {
  constructor(private readonly crudService: CrudService<LspIndividualCoaching>) {
    super(crudService);
  }

  //insert learning service provider coaching
  async addCoachings(dto: CreateLspIndividualCoachingDto, entityManager: EntityManager) {
    const result = await this.crudService.transact<LspIndividualCoaching>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspIndividualDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider coaching
  async deleteCoachings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualCoaching>(entityManager).delete({
      deleteBy: { lspIndividualDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
