import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRequirementsDto, TrainingRequirements } from '@gscwd-api/models';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRequirementsService extends CrudHelper<TrainingRequirements> {
  constructor(private readonly crudService: CrudService<TrainingRequirements>) {
    super(crudService);
  }

  async create(data: CreateTrainingRequirementsDto, entityManager: EntityManager) {
    return await this.crudService.transact<TrainingRequirements>(entityManager).create({
      dto: { trainingNominee: data.nomineeId },
      onError: (error) => {
        throw error;
      },
    });
  }
}
