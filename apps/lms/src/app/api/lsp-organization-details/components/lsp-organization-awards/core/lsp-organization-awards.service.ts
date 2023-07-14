import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualAwardDto, CreateLspOrganizationAwardDto, LspIndividualAward, LspOrganizationAward } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationAwardsService extends CrudHelper<LspOrganizationAward> {
  constructor(private readonly crudService: CrudService<LspOrganizationAward>) {
    super(crudService);
  }

  //insert learning service provider organization awards
  async addAwards(dto: CreateLspOrganizationAwardDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationAward>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider organization awards
  async deleteAwards(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationAward>(entityManager).delete({
      deleteBy: { lspOrganizationDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //return result
    return result;
  }
}
