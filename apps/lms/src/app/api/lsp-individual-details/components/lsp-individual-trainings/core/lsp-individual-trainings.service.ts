import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspIndividualTrainingDto, LspIndividualTraining } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspIndividualTrainingsService extends CrudHelper<LspIndividualTraining> {
  constructor(private readonly crudService: CrudService<LspIndividualTraining>) {
    super(crudService);
  }

  //insert learning service provider training
  async addTrainings(dto: CreateLspIndividualTrainingDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualTraining>(entityManager).create({
      dto: dto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspIndividualDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider training
  async deleteTrainings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspIndividualTraining>(entityManager).delete({
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
