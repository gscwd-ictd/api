import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspTrainingDto, LspTraining } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspTrainingsService extends CrudHelper<LspTraining> {
  constructor(private readonly crudService: CrudService<LspTraining>) {
    super(crudService);
  }

  //insert learning service provider training
  async addTrainings(lspTrainingDto: CreateLspTrainingDto, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspTraining>(entityManager).create({
      dto: lspTrainingDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });

    //deconstruct and return result
    const { lspDetails, ...rest } = result;
    return rest;
  }

  //delete learning service provider training
  async deleteTrainings(lspDetailsId: string, entityManager: EntityManager) {
    //transaction result
    const result = await this.crudService.transact<LspTraining>(entityManager).delete({
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
