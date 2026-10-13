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

  async certificateDocuments(trainingId: string) {
    try {
      const trainingDetails = await this.trainingDetailsService.findTrainingDetailsById(trainingId);

      /* find approval personnel by training id */
      const notedBy = await this.trainingApproovalsService.findApprovalDetailsByTrainingId(trainingId);

      const nominee = await this.trainingNomineesService.findAllNomineesRequirementsByTrainingId(trainingId);

      // Extract base requirement document names
      const baseRequirements = trainingDetails.trainingRequirements.map((req) => req.document);

      const participants: any[] = [];

      const batches = nominee.map((batch) => {
        const qualifiedEmployees = batch.employees
          .filter((employee) =>
            baseRequirements.every((reqName) => {
              const match = employee.requirements.find((r) => r.document === reqName);
              return match && match.isSelected === true;
            })
          )
          .map((items) => {
            return {
              nomineeId: items.nomineeId,
              employeeId: items.employeeId,
              name: items.name,
            };
          }); // remove 'requirements'

        participants.push(...qualifiedEmployees);

        return {
          ...batch,
          employees: qualifiedEmployees,
        };
      });

      return {
        courseTitle: trainingDetails.courseTitle,
        location: trainingDetails.location,
        numberOfParticipants: trainingDetails.numberOfParticipants,
        trainingStart: trainingDetails.trainingStart,
        trainingEnd: trainingDetails.trainingEnd,
        preparedBy: trainingDetails.preparedBy,
        participants,
        batches,
        ...notedBy,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Certificate documents not found.', HttpStatus.NOT_FOUND);
    }
  }
}
