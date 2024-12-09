import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TrainingDetailsService } from '../../../core/training-details.service';
import { TrainingNomineesService } from '../../nominees';
import { TrainingApprovalsService } from '../../approvals';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly trainingDetailsService: TrainingDetailsService,
    private readonly trainingNomineesService: TrainingNomineesService,
    private readonly trainingApproovalsService: TrainingApprovalsService
  ) {}

  /* approval documents */
  async approvalDocuments(trainingId: string) {
    try {
      /* find training details by training id */
      const trainingDetails = await this.trainingDetailsService.findTrainingDetailsById(trainingId);

      /* find batches by training id */
      const batches = await this.trainingNomineesService.findAllBatchByTrainingId(trainingId);

      /* find approval personnel by training id */
      const notedBy = await this.trainingApproovalsService.findApprovalDetailsByTrainingId(trainingId);

      return {
        courseTitle: trainingDetails.courseTitle,
        location: trainingDetails.location,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        batches: batches,
        preparedBy: trainingDetails.preparedBy,
        ...notedBy,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Approval documents not found.', HttpStatus.BAD_REQUEST);
    }
  }
}
