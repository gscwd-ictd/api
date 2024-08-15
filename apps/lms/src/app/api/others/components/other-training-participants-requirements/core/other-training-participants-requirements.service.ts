import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  CreateOtherTrainingParticipantsRequirementsDto,
  OtherTrainingParticipantRequirements,
  UpdateOtherTrainingParticipantsRequirementsDto,
} from '@gscwd-api/models';
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
          trainingRequirements: '[]',
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

  /* find all participants requirements  */
  async findParticipantsRequirementsByParticipantId(participantId: string) {
    try {
      const requirements = await this.crudService.findOneOrNull({
        find: {
          select: {
            id: true,
            trainingRequirements: true,
          },
          where: {
            otherTrainingParticipant: {
              id: participantId,
            },
          },
        },
      });

      return JSON.parse(requirements.trainingRequirements);
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* update training participants requirements by participants id */
  async updateParticipantRequirements(data: UpdateOtherTrainingParticipantsRequirementsDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { participants } = data;

        /* insert participants */
        const updateResults = await Promise.all(
          participants.map(async (items) => {
            return await this.crudService.transact<OtherTrainingParticipantRequirements>(entityManager).update({
              dto: {
                trainingRequirements: JSON.stringify(items.requirements),
              },
              updateBy: {
                otherTrainingParticipant: {
                  id: items.participantId,
                },
              },
              onError: (error) => {
                throw error;
              },
            });
          })
        );

        // Aggregate results
        const aggregatedResult = updateResults.reduce(
          (acc, result) => {
            acc.affected += result.affected;
            return acc;
          },
          { generatedMaps: [], raw: [], affected: 0 }
        );

        return aggregatedResult;
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request.', HttpStatus.BAD_REQUEST);
    }
  }
}
