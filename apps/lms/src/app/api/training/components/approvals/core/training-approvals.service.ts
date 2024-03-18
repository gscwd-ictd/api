import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingApprovalDto, GeneralManagerDto, PdcChairmanDto, PdcSecretaryDto, TrainingApproval } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { NomineeType, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../../nominees';
import { EntityManager, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class TrainingApprovalsService extends CrudHelper<TrainingApproval> {
  constructor(private readonly crudService: CrudService<TrainingApproval>, private readonly trainingNomineesService: TrainingNomineesService) {
    super(crudService);
  }

  /* find all trainings by pdc status */
  async findAllApprovalByPdcStatus(status: TrainingStatus) {
    try {
      /* find all trainings */
      const trainingDetails = (await this.crudService.findAll({
        find: {
          relations: {
            trainingDetails: {
              trainingDesign: true,
              source: true,
            },
          },
          select: {
            id: true,
            remarks: true,
            trainingDetails: {
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
              id: true,
              courseTitle: true,
              trainingDesign: {
                courseTitle: true,
              },
              numberOfHours: true,
              numberOfParticipants: true,
              location: true,
              trainingStart: true,
              trainingEnd: true,
              source: {
                name: true,
              },
              type: true,
              status: true,
            },
          },
          where: {
            trainingDetails: {
              status: MoreThanOrEqual(status),
            },
          },
          order: {
            updatedAt: 'DESC',
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<TrainingApproval>;

      return await Promise.all(
        trainingDetails.map(async (items) => {
          const trainingId = items.id;
          const trainingStatus = TrainingStatus.PDC_SECRETARY_APPROVAL;
          const nomineeType = NomineeType.NOMINEE;
          const nomineeStatus = TrainingNomineeStatus.ACCEPTED;

          /* find all training nominees */
          const nominees = await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId, trainingStatus, nomineeType, nomineeStatus);

          /* custom returns */
          return {
            createdAt: items.trainingDetails.createdAt,
            updatedAt: items.trainingDetails.updatedAt,
            deletedAt: items.trainingDetails.deletedAt,
            id: items.id,
            courseTitle: items.trainingDetails.courseTitle || items.trainingDetails.trainingDesign.courseTitle,
            numberOfParticipants: items.trainingDetails.numberOfParticipants,
            location: items.trainingDetails.location,
            trainingStart: items.trainingDetails.trainingStart,
            trainingEnd: items.trainingDetails.trainingEnd,
            source: items.trainingDetails.source.name,
            type: items.trainingDetails.type,
            status: items.trainingDetails.status,
            remarks: items.remarks,
            nominees: nominees,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* insert training approval */
  async createApproval(data: CreateTrainingApprovalDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<TrainingApproval>(entityManager).create({
        dto: data,
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* pdc secretary approved training by training id*/
  async pdcSecretaryApproved(data: PdcSecretaryDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcSecretary } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          pdcSecretary: pdcSecretary,
          pdcSecretaryApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.PDC_CHAIRMAN_APPROVAL,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* pdc secretary declined training by training id */
  async pdcSecretaryDeclined(data: PdcSecretaryDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcSecretary } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          pdcSecretary: pdcSecretary,
          pdcSecretaryApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.PDC_SECRETARY_DECLINED,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* pdc chairman approved training by training id*/
  async pdcChairmanApproved(data: PdcChairmanDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcChairman } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          pdcChairman: pdcChairman,
          pdcChairmanApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.GM_APPROVAL,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* pdc chairman declined training by training id*/
  async pdcChairmanDeclined(data: PdcChairmanDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcChairman } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          pdcChairman: pdcChairman,
          pdcChairmanApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.PDC_CHAIRMAN_DECLINED,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  /* general manager approved training by training id */
  async generalManagerApproval(data: GeneralManagerDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, generalManager } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          generalManager: generalManager,
          generalManagerApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.FOR_BATCHING,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // general manager declined training
  async generalManagerDeclined(data: GeneralManagerDto) {
    try {
      /* deconstruct data */
      const { trainingDetails, generalManager } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.update({
        updateBy: {
          trainingDetails: trainingDetails,
        },
        dto: {
          generalManager: generalManager,
          generalManagerApprovalDate: today,
          trainingDetails: {
            status: TrainingStatus.GM_DECLINED,
          },
        },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
