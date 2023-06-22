import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualAwardDto, LspIndividualAward } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualAwardsService extends CrudHelper<LspIndividualAward> {
  constructor(private readonly crudService: CrudService<LspIndividualAward>) {
    super(crudService);
  }

  //insert learning service provider awards
  async addAwards(dto: CreateLspIndividualAwardDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualAward>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider awards
  async deleteAwards(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualAward>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
