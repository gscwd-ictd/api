import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingRequirementsDto, RequirementsDto, TrainingRequirements } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRequirementsService extends CrudHelper<TrainingRequirements> {
  constructor(private readonly crudService: CrudService<TrainingRequirements>) {
    super(crudService);
  }

  /* insert nominee requirements by nominee id */
  async createNomineeRequirements(nomineeId: string, requirements: RequirementsDto, entityManager: EntityManager) {
    try {
      /* remove nominee requirements by nominee id */
      await this.deleteNomineeRequirements(nomineeId, entityManager);

      /* insert nominee requirements */
      return await this.crudService.transact<TrainingRequirements>(entityManager).create({
        dto: {
          trainingNominee: {
            id: nomineeId,
          },
          ...requirements,
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  /* delete nominee requirement by nominee id */
  async deleteNomineeRequirements(nomineeId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingRequirements>(entityManager).delete({
        deleteBy: {
          trainingNominee: {
            id: nomineeId,
          },
        },
        softDelete: false,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
