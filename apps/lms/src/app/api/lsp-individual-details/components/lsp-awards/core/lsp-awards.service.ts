import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspAwardDto, LspAward } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspAwardsService extends CrudHelper<LspAward> {
  constructor(private readonly crudService: CrudService<LspAward>) {
    super(crudService);
  }

  //insert learning service provider awards
  async addAwards(dto: CreateLspAwardDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspAward>(entityManager).create({
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
    const result = await this.crudService.transact<LspAward>(entityManager).delete({
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
