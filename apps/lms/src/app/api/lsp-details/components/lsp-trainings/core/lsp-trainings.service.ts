import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateLspTrainingDto, LspTraining } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class LspTrainingsService extends CrudHelper<LspTraining> {
  constructor(private readonly crudService: CrudService<LspTraining>) {
    super(crudService);
  }

  async addLspTrainings(lspTrainingDto: CreateLspTrainingDto, entityManager: EntityManager) {
    const lspTraining = await this.crudService.transact<LspTraining>(entityManager).create({
      dto: lspTrainingDto,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { lspDetails, ...rest } = lspTraining;
    return rest;
  }

  async deleteAllLspTrainingssByLspDetailsIdTransaction(lspDetailsId: string, entityManager: EntityManager) {
    const deleteResult = await this.crudService.transact<LspTraining>(entityManager).delete({
      deleteBy: { lspDetails: { id: lspDetailsId } },
      softDelete: false,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    return deleteResult;
  }
}
