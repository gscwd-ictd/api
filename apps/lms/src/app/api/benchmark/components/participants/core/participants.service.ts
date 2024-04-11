import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BenchmarkParticipants, CreateBenchmarkParticipantsDto, UpdateBenchmarkParticipantsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';
import { BenchmarkParticipantRequirementsService } from '../../participants-requirements';

@Injectable()
export class BenchmarkParticipantsService extends CrudHelper<BenchmarkParticipants> {
  constructor(
    private readonly crudService: CrudService<BenchmarkParticipants>,
    private readonly benchmarkParticipantRequirementsService: BenchmarkParticipantRequirementsService
  ) {
    super(crudService);
  }

  /* find all participants by benchmark id */
  async findAllParticipantsByBenchmarkId(benchmarkId: string) {
    try {
      /* find all participants */
      const employees = (await this.crudService.findAll({
        find: {
          select: {
            id: true,
            employeeId: true,
          },
          where: {
            benchmark: {
              id: benchmarkId,
            },
          },
        },
        onError: (error) => {
          throw error;
        },
      })) as Array<BenchmarkParticipants>;

      /* custom return participants*/
      return await Promise.all(
        employees.map(async (items) => {
          /* find requirements */
          const requirements = await this.benchmarkParticipantRequirementsService.findParticipantRequirementsByParticipantsId(items.id);

          /* custom return */
          return {
            benchmarkParticipants: items.id,
            supevisorName: '',
            employeeId: items.employeeId,
            name: '',
            learningApplicationPlan: requirements,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /*  insert benchmark participants */
  async createParticipants(data: CreateBenchmarkParticipantsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmark, employeeId } = data;

      /* insert participants */
      const participants = await this.crudService.transact<BenchmarkParticipants>(entityManager).create({
        dto: {
          benchmark: {
            id: benchmark,
          },
          employeeId: employeeId,
        },
        onError: (error) => {
          throw error;
        },
      });

      /* insert requirements */
      await this.benchmarkParticipantRequirementsService.createParticipantRequirements(
        {
          benchmarkParticipants: participants.id,
        },
        entityManager
      );

      /* custom return */
      return {
        employeeId: participants.employeeId,
      };
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /*  edit benchmark participants */
  async updateParticipants(data: UpdateBenchmarkParticipantsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmark, employeeId, learningApplicationPlan } = data;

      /* insert participants */
      const participants = await this.crudService.transact<BenchmarkParticipants>(entityManager).create({
        dto: {
          benchmark: {
            id: benchmark,
          },
          employeeId: employeeId,
        },
        onError: (error) => {
          throw error;
        },
      });

      /* insert requirements */
      await this.benchmarkParticipantRequirementsService.createParticipantRequirementsWithRequirements(
        {
          benchmarkParticipants: participants.id,
          learningApplicationPlan: learningApplicationPlan,
        },
        entityManager
      );

      /* custom return */
      return {
        affected: 1,
      };
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505' && error instanceof QueryFailedError) {
        throw new HttpException('Duplicate key violation', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
    }
  }

  /* remove participants by benchmark id */
  async deleteParticipants(benchmarkId: string, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<BenchmarkParticipants>(entityManager).delete({
        deleteBy: {
          benchmark: {
            id: benchmarkId,
          },
        },
        softDelete: false,
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
