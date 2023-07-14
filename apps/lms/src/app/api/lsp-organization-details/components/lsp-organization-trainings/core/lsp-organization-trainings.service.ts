import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspOrganizationTrainingDto, LspOrganizationTraining } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspOrganizationTrainingsService extends CrudHelper<LspOrganizationTraining> {
  constructor(private readonly crudService: CrudService<LspOrganizationTraining>) {
    super(crudService);
  }

  //insert learning service provider organization training
  async addTrainings(data: CreateLspOrganizationTrainingDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationTraining>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspOrganizationDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider organization training
  async deleteTrainings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspOrganizationTraining>(entityManager).delete({
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
