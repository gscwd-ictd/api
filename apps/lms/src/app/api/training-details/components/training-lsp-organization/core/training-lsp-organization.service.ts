import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingLspOrganizationDto, TrainingLspOrganization } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingLspOrganizationService extends CrudHelper<TrainingLspOrganization> {
  constructor(private readonly crudService: CrudService<TrainingLspOrganization>) {
    super(crudService);
  }

  async addTrainingLspOrganization(data: CreateTrainingLspOrganizationDto, entityManager: EntityManager) {
    //transaction results
    const results = await this.crudService.transact<TrainingLspOrganization>(entityManager).create({
      dto: data,
      onError: ({ error }) => {
        return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
      },
    });
    const { trainingDetails, ...rest } = results;
    return rest;
  }
}
