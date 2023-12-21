import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateTrainingApprovalDto, SubmissionToSecretariateDto, TrainingApproval } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TrainingApprovalsService extends CrudHelper<TrainingApproval> {
  constructor(private readonly crudService: CrudService<TrainingApproval>) {
    super(crudService);
  }

  //insert training tag
  async create(data: CreateTrainingApprovalDto, entityManager: EntityManager) {
    //transaction results
    return await this.crudService.transact<TrainingApproval>(entityManager).create({
      dto: data,
      onError: (error) => {
        throw error;
      },
    });
  }

  // training approval of PDC Secretariate
  async submissionToSecretariate(data: SubmissionToSecretariateDto) {
    try {
      const { trainingDetails, pdcSecretary } = data;
      const dateTimeToday = new Date();
      return await this.crudService.update({
        updateBy: { trainingDetails: trainingDetails },
        dto: { pdcSecretary: pdcSecretary, pdcSecretaryApprovalDate: dateTimeToday },
        onError: (error) => {
          throw error;
        },
      });
    } catch (error) {
      Logger.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
}
