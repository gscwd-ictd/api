import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BatchRequirementsDto, RequirementsDto, TrainingRequirements } from '@gscwd-api/models';
import { DocumentRequirementsType } from '@gscwd-api/utils';
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
  async updateNomineeRequirements(data: BatchRequirementsDto) {
    try {
      /* deconstruct data */
      const { employees } = data;

      return await Promise.all(
        employees.map(async (items) => {
          const { nomineeId, requirements } = items;
          const attendance = requirements.find((items) => items.document === DocumentRequirementsType.ATTENDANCE).isSelected;
          const preTest = requirements.find((items) => items.document === DocumentRequirementsType.PRE_TEST).isSelected;
          const courseMaterials = requirements.find((items) => items.document === DocumentRequirementsType.COURSE_MATERIALS).isSelected;
          const postTrainingReport = requirements.find((items) => items.document === DocumentRequirementsType.POST_TRAINING_REPORT).isSelected;
          const courseEvaluationReport = requirements.find(
            (items) => items.document === DocumentRequirementsType.COURSE_EVALUATION_REPORT
          ).isSelected;
          const learningApplicationPlan = requirements.find(
            (items) => items.document === DocumentRequirementsType.LEARNING_APPLICATION_PLAN
          ).isSelected;
          const postTest = requirements.find((items) => items.document === DocumentRequirementsType.POST_TEST).isSelected;
          const certificateOfTraining = requirements.find((items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_TRAINING).isSelected;
          const certificateOfAppearance = requirements.find(
            (items) => items.document === DocumentRequirementsType.CERTIFICATE_OF_APPEARANCE
          ).isSelected;
          const program = requirements.find((items) => items.document === DocumentRequirementsType.PROGRAM).isSelected;

          /* update nominee requirements */
          return await this.crudService.update({
            updateBy: {
              trainingNominee: {
                id: nomineeId,
              },
            },
            dto: {
              attendance: attendance,
              preTest: preTest,
              courseMaterials: courseMaterials,
              postTrainingReport: postTrainingReport,
              courseEvaluationReport: courseEvaluationReport,
              learningApplicationPlan: learningApplicationPlan,
              postTest: postTest,
              certificateOfTraining: certificateOfTraining,
              certificateOfAppearance: certificateOfAppearance,
              program: program,
            },
            onError: (error) => {
              throw error;
            },
          });
        })
      );
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
