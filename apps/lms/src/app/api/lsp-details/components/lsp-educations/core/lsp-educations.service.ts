import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspEducationDto, LspEducation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspEducationsService extends CrudHelper<LspEducation> {
  constructor(private readonly crudService: CrudService<LspEducation>) {
    super(crudService);
  }

  //insert learning service provider education
  async addEducations(dto: CreateLspEducationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspEducation>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider education
  async deleteEducations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspEducation>(entityManager).delete({
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
