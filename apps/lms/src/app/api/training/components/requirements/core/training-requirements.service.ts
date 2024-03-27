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
      const requirements = (await this.crudService.findOne({
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
            certificateOfAppearance: true,
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
      })) as TrainingRequirements;

      return [
        {
          document: 'Attendance',
          isSelected: requirements.attendance,
        },
        {
          document: 'Pre-test',
          isSelected: requirements.preTest,
        },
        {
          document: 'Course Materials',
          isSelected: requirements.courseMaterials,
        },
        {
          document: 'Post Training Report',
          isSelected: requirements.postTrainingReport,
        },
        {
          document: 'Course Evaluation Report',
          isSelected: requirements.courseEvaluationReport,
        },
        {
          document: 'Learning Application Plan',
          isSelected: requirements.learningApplicationPlan,
        },
        {
          document: 'Post-test',
          isSelected: requirements.postTest,
        },
        {
          document: 'Certificate of Training',
          isSelected: requirements.certificateOfTraining,
        },
        {
          document: 'Certificate of Appearance',
          isSelected: requirements.certificateOfAppearance,
        },
        {
          document: 'Program',
          isSelected: requirements.program,
        },
      ];
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
