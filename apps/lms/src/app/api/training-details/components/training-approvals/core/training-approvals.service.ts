import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingApprovalDto, PdcChairmanDto, PdcSecretaryDto, TrainingApproval, TrainingDetails } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TrainingDetailsService } from '../../../core/training-details.service';
import { TrainingPreparationStatus } from '@gscwd-api/utils';

@Injectable()
export class TrainingApprovalsService extends CrudHelper<TrainingApproval> {
  constructor(
    private readonly crudService: CrudService<TrainingApproval>,
    private readonly trainingDetailsService: TrainingDetailsService,
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
              trainingPreparationStatus: TrainingPreparationStatus.PDC_SECRETARY_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        await this.crudService.transact<TrainingApproval>(entityManager).create({
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

  // training approval of PDC Secretariate
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
              trainingPreparationStatus: TrainingPreparationStatus.PDC_CHAIRMAN_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        await this.crudService.transact<TrainingApproval>(entityManager).update({
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

  // training approval of PDC Chairman
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
              trainingPreparationStatus: TrainingPreparationStatus.GM_APPROVAL,
            },
            onError: (error) => {
              throw error;
            },
          });

        await this.crudService.update({
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
}
