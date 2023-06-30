import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationEducationDto, LspOrganizationEducation } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationEducationsService extends CrudHelper<LspOrganizationEducation> {
  constructor(private readonly crudService: CrudService<LspOrganizationEducation>) {
    super(crudService);
  }

  //insert learning service provider organization education
  async addEducations(data: CreateLspOrganizationEducationDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationEducation>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //insert learning service provider organization education
  async deleteEducations(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationEducation>(entityManager).delete({
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
