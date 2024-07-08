import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { CreateOtherTrainingParticipantsRequirementsDto, OtherTrainingParticipantRequirements } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class OtherTrainingParticipantsRequirementsService extends CrudHelper<OtherTrainingParticipantRequirements> {
  constructor(private readonly crudService: CrudService<OtherTrainingParticipantRequirements>, private readonly dataSource: DataSource) {
    super(crudService);
  }

  /* insert participants requirements */
  async createParticipantRequirements(data: CreateOtherTrainingParticipantsRequirementsDto, entityManager: EntityManager) {
    try {
      const { otherTrainingParticipant } = data;

      return await this.crudService.transact<OtherTrainingParticipantRequirements>(entityManager).create({
        dto: {
          otherTrainingParticipant: {
            id: otherTrainingParticipant,
          },
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
}
