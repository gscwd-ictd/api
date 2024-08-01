import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingApprovalDto, GeneralManagerDto, PdcChairmanDto, PdcSecretariatDto, TrainingApproval } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { NomineeType, TrainingNomineeStatus, TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../../nominees';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { HrmsEmployeesService } from '../../../../../services/hrms';

@Injectable()
export class TrainingApprovalsService extends CrudHelper<TrainingApproval> {
  constructor(
    private readonly crudService: CrudService<TrainingApproval>,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly hrmsEmployeesService: HrmsEmployeesService
  ) {
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
          const trainingId = items.trainingDetails.id;
          const trainingStatus = items.trainingDetails.status;

          const nomineeType = NomineeType.NOMINEE;
          const nomineeStatus = TrainingNomineeStatus.ACCEPTED;

          /* find all training nominees */
          const nominees = await this.trainingNomineesService.findAllNomineeByTrainingId(trainingId, trainingStatus, nomineeType, nomineeStatus);

          /* custom returns */
          return {
            createdAt: items.trainingDetails.createdAt,
            updatedAt: items.trainingDetails.updatedAt,
            deletedAt: items.trainingDetails.deletedAt,
            trainingId: items.trainingDetails.id,
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

  /* tdd manager approval of training by training id*/
  async tddManagerApproval(trainingId: string, employeeId: string, entityManager: EntityManager) {
    try {
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.transact<TrainingApproval>(entityManager).update({
        updateBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        dto: {
          tddManager: employeeId,
          tddManagerApprovalDate: today,
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

  /* pdc secretariat approval of training by training id*/
  async pdcSecretariatApproval(data: PdcSecretariatDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcSecretariat, remarks } = data;

      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.transact<TrainingApproval>(entityManager).update({
        updateBy: {
          trainingDetails: {
            id: trainingDetails,
          },
        },
        dto: {
          pdcSecretariat: pdcSecretariat,
          pdcSecretariatApprovalDate: today,
          remarks: remarks,
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

  /* pdc chairman approval of training by training id*/
  async pdcChairmanApproval(data: PdcChairmanDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { trainingDetails, pdcChairman, remarks } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.transact<TrainingApproval>(entityManager).update({
        updateBy: {
          trainingDetails: { id: trainingDetails },
        },
        dto: {
          pdcChairman: pdcChairman,
          pdcChairmanApprovalDate: today,
          remarks: remarks,
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

  /* general manager approval of training by training id */
  async generalManagerApproval(data: GeneralManagerDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { trainingDetails, generalManager, remarks } = data;
      /* set the date to today */
      const today = new Date();

      /* edit training status and set date approval */
      return await this.crudService.transact<TrainingApproval>(entityManager).update({
        updateBy: {
          trainingDetails: {
            id: trainingDetails,
          },
        },
        dto: {
          generalManager: generalManager,
          generalManagerApprovalDate: today,
          remarks: remarks,
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

  /* find approval details */
  async findApprovalDetailsByTrainingId(trainingId: string) {
    try {
      const approvalDetails = await this.crudService.findOneBy({
        findBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const tddManager = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.tddManager);
      const pdcSecretariat = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.pdcSecretariat);
      const pdcChairman = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.pdcChairman);
      const generalManager = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.generalManager);

      return {
        tddManager: {
          employeeId: approvalDetails.tddManager,
          name: tddManager.employeeFullNameFirst,
          positionTitle: tddManager.assignment.positionTitle,
        },
        pdcSecretariat: {
          employeeId: approvalDetails.pdcSecretariat,
          name: pdcSecretariat.employeeFullNameFirst,
          positionTitle: pdcSecretariat.assignment.positionTitle,
        },
        pdcChairman: {
          employeeId: approvalDetails.pdcSecretariat,
          name: pdcChairman.employeeFullNameFirst,
          positionTitle: pdcChairman.assignment.positionTitle,
        },
        generalManager: {
          employeeId: approvalDetails.generalManager,
          name: generalManager.employeeFullNameFirst,
          positionTitle: generalManager.assignment.positionTitle,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found approval details.', HttpStatus.NOT_FOUND);
    }
  }

  /* find tdd manager approval by training id */
  async findTddManagerApprovalByTrainingId(trainingId: string) {
    try {
      const approvalDetails = await this.crudService.findOneBy({
        findBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const tddManager = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.tddManager);

      return {
        tddManager: {
          employeeId: approvalDetails.tddManager,
          name: tddManager.employeeFullNameFirst,
          positionTitle: tddManager.assignment.positionTitle,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found approval details.', HttpStatus.NOT_FOUND);
    }
  }

  /* find pdc secretariat approval by training id */
  async findPdcSecretariatApprovalByTrainingId(trainingId: string) {
    try {
      const approvalDetails = await this.crudService.findOneBy({
        findBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const pdcSecretariat = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.pdcSecretariat);

      return {
        pdcSecretariat: {
          employeeId: approvalDetails.pdcSecretariat,
          name: pdcSecretariat.employeeFullNameFirst,
          positionTitle: pdcSecretariat.assignment.positionTitle,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found approval details.', HttpStatus.NOT_FOUND);
    }
  }

  /* find pdc chairman approval by training id */
  async findPdcChairmanApprovalByTrainingId(trainingId: string) {
    try {
      const approvalDetails = await this.crudService.findOneBy({
        findBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const pdcChairman = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.pdcChairman);

      return {
        pdcChairman: {
          employeeId: approvalDetails.pdcChairman,
          name: pdcChairman.employeeFullNameFirst,
          positionTitle: pdcChairman.assignment.positionTitle,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found approval details.', HttpStatus.NOT_FOUND);
    }
  }

  /* find pdc general manager approval by training id */
  async findGeneralManagerApprovalByTrainingId(trainingId: string) {
    try {
      const approvalDetails = await this.crudService.findOneBy({
        findBy: {
          trainingDetails: {
            id: trainingId,
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      const generalManager = await this.hrmsEmployeesService.findEmployeeDetailsByEmployeeId(approvalDetails.generalManager);

      return {
        generalManager: {
          employeeId: approvalDetails.generalManager,
          name: generalManager.employeeFullNameFirst,
          positionTitle: generalManager.assignment.positionTitle,
        },
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found approval details.', HttpStatus.NOT_FOUND);
    }
  }
}
