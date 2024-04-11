import { CrudHelper, CrudService } from '@gscwd-api/crud';
import {
  BenchmarkParticipantRequirements,
  CreateBenchmarkParticipantRequirementsDto,
  UpdateBenchmarkParticipantRequirementsDto,
} from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class BenchmarkParticipantRequirementsService extends CrudHelper<BenchmarkParticipantRequirements> {
  constructor(private readonly crudService: CrudService<BenchmarkParticipantRequirements>) {
    super(crudService);
  }

  /* find participants requirements */
  async findParticipantRequirementsByParticipantsId(participantsId: string) {
    try {
      const requirements = await this.crudService.findOne({
        find: {
          select: {
            id: true,
            learningApplicationPlan: true,
          },
          where: {
            benchmarkParticipants: {
              id: participantsId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      });

      /* custom return */
      return requirements.learningApplicationPlan;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert participant requirements with no requirements */
  async createParticipantRequirements(data: CreateBenchmarkParticipantRequirementsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmarkParticipants } = data;

      return await this.crudService.transact<BenchmarkParticipantRequirements>(entityManager).create({
        dto: {
          benchmarkParticipants: {
            id: benchmarkParticipants,
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

  /* insert participant requirements with requirements */
  async createParticipantRequirementsWithRequirements(data: UpdateBenchmarkParticipantRequirementsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmarkParticipants, learningApplicationPlan } = data;

      /* insert requirements */
      return await this.crudService.transact<BenchmarkParticipantRequirements>(entityManager).create({
        dto: {
          benchmarkParticipants: {
            id: benchmarkParticipants,
          },
          learningApplicationPlan: learningApplicationPlan,
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

  /* update participant requirements by participant id */
  async updateParticipantRequirementsByParticipantId(data: UpdateBenchmarkParticipantRequirementsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmarkParticipants, learningApplicationPlan } = data;
      return await this.crudService.transact<BenchmarkParticipantRequirements>(entityManager).update({
        updateBy: {
          benchmarkParticipants: {
            id: benchmarkParticipants,
          },
        },
        dto: {
          learningApplicationPlan: learningApplicationPlan,
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
