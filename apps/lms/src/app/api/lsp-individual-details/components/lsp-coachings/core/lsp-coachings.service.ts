import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspCoachingDto, LspCoaching } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspCoachingsService extends CrudHelper<LspCoaching> {
  constructor(private readonly crudService: CrudService<LspCoaching>) {
    super(crudService);
  }

  //insert learning service provider coaching
  async addCoachings(dto: CreateLspCoachingDto, entityManager: EntityManager) {
    const result = await this.crudService.transact<LspCoaching>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider coaching
  async deleteCoachings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspCoaching>(entityManager).delete({
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
