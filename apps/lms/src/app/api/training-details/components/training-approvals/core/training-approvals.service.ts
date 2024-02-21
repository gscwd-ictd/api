import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingApprovalDto, GeneralManagerDto, PdcChairmanDto, PdcSecretaryDto, TrainingApproval, TrainingDetails } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { And, DataSource, Equal, Not } from 'typeorm';
import { TrainingDetailsService } from '../../../core/training-details.service';
import { TrainingStatus } from '@gscwd-api/utils';
import { TrainingNomineesService } from '../../training-nominees';

@Injectable()
export class TrainingApprovalsService extends CrudHelper<TrainingApproval> {
  constructor(
    private readonly crudService: CrudService<TrainingApproval>,
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly datasource: DataSource
  ) {
    super(crudService);
  }

  // insert training approval
  async create(data: CreateTrainingApprovalDto) {
    try {
      const { trainingDetails } = data;
      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.PDC_SECRETARY_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.transact<TrainingApproval>(entityManager).create({
          dto: data,
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // find all training to approved by pdc secretary
  async findAllpdcSecretaryApproval() {
    try {
      const trainingDetails = (await this.trainingDetailsService.crud().findAll({
        find: {
          relations: { source: true, trainingDesign: true },
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            id: true,
            courseTitle: true,
            trainingDesign: { courseTitle: true },
            numberOfHours: true,
            numberOfParticipants: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            source: { name: true },
            type: true,
            status: true,
          },
          where: { status: And(Not(Equal(TrainingStatus.PENDING)), Not(Equal(TrainingStatus.ON_GOING_NOMINATION))) },
          order: { status: 'ASC', trainingStart: 'DESC' },
        },
        onError: () => new InternalServerErrorException(),
      })) as Array<TrainingDetails>;

      return await Promise.all(
        trainingDetails.map(async (trainingItems) => {
          const nominee = await this.trainingNomineesService.findAll(trainingItems.id);
          const remarks = await this.crudService.findOne({
            find: { relations: { trainingDetails: true }, select: { id: true, remarks: true }, where: { trainingDetails: { id: trainingItems.id } } },
          });

          return {
            createdAt: trainingItems.createdAt,
            updatedAt: trainingItems.updatedAt,
            deletedAt: trainingItems.deletedAt,
            id: trainingItems.id,
            courseTitle: trainingItems.courseTitle || trainingItems.trainingDesign.courseTitle,
            numberOfParticipants: trainingItems.numberOfParticipants,
            location: trainingItems.location,
            trainingStart: trainingItems.trainingStart,
            trainingEnd: trainingItems.trainingEnd,
            source: trainingItems.source.name,
            type: trainingItems.type,
            status: trainingItems.status,
            nominee: nominee,
            remarks: remarks.remarks,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // pdc chairman approved training
  async pdcSecretaryApproval(data: PdcSecretaryDto) {
    try {
      const { trainingDetails, pdcSecretary } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.PDC_CHAIRMAN_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.transact<TrainingApproval>(entityManager).update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { pdcSecretary: pdcSecretary, pdcSecretaryApprovalDate: dateTimeToday },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // pdc secretary declined training
  async pdcSecretaryDeclined(data: PdcSecretaryDto) {
    try {
      const { trainingDetails, pdcSecretary, remarks } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.PDC_SECRETARY_DECLINED,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.transact<TrainingApproval>(entityManager).update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { pdcSecretary: pdcSecretary, pdcSecretaryApprovalDate: dateTimeToday, remarks: remarks },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // find all training to approved by pdc chairman
  async findAllpdcChairmanApproval() {
    try {
      const trainingDetails = (await this.trainingDetailsService.crud().findAll({
        find: {
          relations: { source: true, trainingDesign: true },
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            id: true,
            courseTitle: true,
            trainingDesign: { courseTitle: true },
            numberOfHours: true,
            numberOfParticipants: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            source: { name: true },
            type: true,
            status: true,
          },
          where: {
            status: And(
              Not(Equal(TrainingStatus.PENDING)),
              Not(Equal(TrainingStatus.ON_GOING_NOMINATION)),
              Not(Equal(TrainingStatus.PDC_SECRETARY_APPROVAL)),
              Not(Equal(TrainingStatus.PDC_SECRETARY_DECLINED))
            ),
          },
          order: { status: 'ASC', trainingStart: 'DESC' },
        },
        onError: () => new InternalServerErrorException(),
      })) as Array<TrainingDetails>;

      return await Promise.all(
        trainingDetails.map(async (trainingItems) => {
          const nominee = await this.trainingNomineesService.findAllNomineeByTrainingId(trainingItems.id);
          const remarks = await this.crudService.findOne({
            find: { relations: { trainingDetails: true }, select: { id: true, remarks: true }, where: { trainingDetails: { id: trainingItems.id } } },
          });

          return {
            createdAt: trainingItems.createdAt,
            updatedAt: trainingItems.updatedAt,
            deletedAt: trainingItems.deletedAt,
            id: trainingItems.id,
            courseTitle: trainingItems.courseTitle || trainingItems.trainingDesign.courseTitle,
            numberOfHours: trainingItems.numberOfHours,
            numberOfParticipants: trainingItems.numberOfParticipants,
            location: trainingItems.location,
            trainingStart: trainingItems.trainingStart,
            trainingEnd: trainingItems.trainingEnd,
            source: trainingItems.source.name,
            type: trainingItems.type,
            status: trainingItems.status,
            nominee: nominee,
            remarks: remarks.remarks,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // pdc chairman approved training
  async pdcChairmanApproval(data: PdcChairmanDto) {
    try {
      const { trainingDetails, pdcChairman } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.GM_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { pdcChairman: pdcChairman, pdcChairmanApprovalDate: dateTimeToday },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // pdc chairman declined training
  async pdcChairmanDeclined(data: PdcChairmanDto) {
    try {
      const { trainingDetails, pdcChairman, remarks } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.PDC_CHAIRMAN_DECLINED,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { pdcChairman: pdcChairman, pdcChairmanApprovalDate: dateTimeToday, remarks: remarks },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // find all training to approved by general manager
  async findAllGeneralManagerApproval() {
    try {
      const trainingDetails = (await this.trainingDetailsService.crud().findAll({
        find: {
          relations: { source: true, trainingDesign: true },
          select: {
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            id: true,
            courseTitle: true,
            trainingDesign: { courseTitle: true },
            numberOfHours: true,
            numberOfParticipants: true,
            location: true,
            trainingStart: true,
            trainingEnd: true,
            source: { name: true },
            type: true,
            status: true,
          },
          where: {
            status: And(
              Not(Equal(TrainingStatus.PENDING)),
              Not(Equal(TrainingStatus.ON_GOING_NOMINATION)),
              Not(Equal(TrainingStatus.PDC_SECRETARY_APPROVAL)),
              Not(Equal(TrainingStatus.PDC_SECRETARY_DECLINED)),
              Not(Equal(TrainingStatus.PDC_CHAIRMAN_APPROVAL)),
              Not(Equal(TrainingStatus.PDC_CHAIRMAN_DECLINED))
            ),
          },
          order: { status: 'ASC', trainingStart: 'DESC' },
        },
        onError: () => new InternalServerErrorException(),
      })) as Array<TrainingDetails>;

      return await Promise.all(
        trainingDetails.map(async (trainingItems) => {
          const nominee = await this.trainingNomineesService.findAllNomineeByTrainingId(trainingItems.id);
          const remarks = await this.crudService.findOne({
            find: { relations: { trainingDetails: true }, select: { id: true, remarks: true }, where: { trainingDetails: { id: trainingItems.id } } },
          });

          return {
            createdAt: trainingItems.createdAt,
            updatedAt: trainingItems.updatedAt,
            deletedAt: trainingItems.deletedAt,
            id: trainingItems.id,
            courseTitle: trainingItems.courseTitle || trainingItems.trainingDesign.courseTitle,
            numberOfHours: trainingItems.numberOfHours,
            numberOfParticipants: trainingItems.numberOfParticipants,
            location: trainingItems.location,
            trainingStart: trainingItems.trainingStart,
            trainingEnd: trainingItems.trainingEnd,
            source: trainingItems.source.name,
            type: trainingItems.type,
            status: trainingItems.status,
            nominee: nominee,
            remarks: remarks.remarks,
          };
        })
      );
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // general manager approved training
  async generalManagerApproval(data: GeneralManagerDto) {
    try {
      const { trainingDetails, generalManager } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.FOR_BATCHING,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { generalManager: generalManager, generalManagerApprovalDate: dateTimeToday },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  // general manager declined training
  async generalManagerDeclined(data: GeneralManagerDto) {
    try {
      const { trainingDetails, generalManager, remarks } = data;
      const dateTimeToday = new Date();

      return await this.datasource.transaction(async (entityManager) => {
        await this.trainingDetailsService
          .crud()
          .transact<TrainingDetails>(entityManager)
          .update({
            updateBy: trainingDetails,
            dto: {
              status: TrainingStatus.GM_DECLINED,
            },
            onError: (error) => {
              throw error;
            },
          });

        return await this.crudService.update({
          updateBy: { trainingDetails: trainingDetails },
          dto: { generalManager: generalManager, pdcChairmanApprovalDate: dateTimeToday, remarks: remarks },
          onError: (error) => {
            throw error;
          },
        });
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
