import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationCoachingDto, LspOrganizationCoaching } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationCoachingsService extends CrudHelper<LspOrganizationCoaching> {
  constructor(private readonly crudService: CrudService<LspOrganizationCoaching>) {
    super(crudService);
  }

  //insert learning service provider organization coaching
  async addCoachings(data: CreateLspOrganizationCoachingDto, entityManager: EntityManager) {
    const result = await this.crudService.transact<LspOrganizationCoaching>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider organization coaching
  async deleteCoachings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationCoaching>(entityManager).delete({
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
