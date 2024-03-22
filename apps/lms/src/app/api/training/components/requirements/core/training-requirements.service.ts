import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { RequirementsDto, TrainingRequirements, UpdateTrainingRequirementsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingRequirementsService extends CrudHelper<TrainingRequirements> {
  constructor(private readonly crudService: CrudService<TrainingRequirements>) {
    super(crudService);
  }

  /* find all nominee requirements by nominee id */
  async findNomineeRequirementsByNomineeId(nomineeId: string) {
    try {
      return await this.crudService.findOne({
        find: {
          select: {
            id: true,
            attendance: true,
            preTest: true,
            courseMaterials: true,
            postTrainingReport: true,
            courseEvaluationReport: true,
            learningApplicationPlan: true,
            postTest: true,
            certificateOfTraining: true,
            program: true,
          },
          where: {
            trainingNominee: {
              id: nomineeId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
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

  /* update nominee requirements by nominee id */
  async updateNomineeRequirements(data: UpdateTrainingRequirementsDto) {
    try {
      /* deconstruct data */
      const { nomineeId, ...rest } = data;

      /* update nominee requirements */
      return await this.crudService.update({
        updateBy: {
          trainingNominee: {
            id: nomineeId,
          },
        },
        dto: {
          ...rest,
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
