import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualEducationDto, LspIndividualEducation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualEducationsService extends CrudHelper<LspIndividualEducation> {
  constructor(private readonly crudService: CrudService<LspIndividualEducation>) {
    super(crudService);
  }

  //insert learning service provider education
  async addEducations(dto: CreateLspIndividualEducationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualEducation>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspIndividualDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider education
  async deleteEducations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualEducation>(entityManager).delete({
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
