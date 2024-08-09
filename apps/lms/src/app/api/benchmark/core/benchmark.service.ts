import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Benchmark, BenchmarkParticipantRequirementsDto, CreateBenchmarkDto, UpdateBenchmarkDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BenchmarkParticipantsService } from '../components/participants';
import { BenchmarkParticipantRequirementsService } from '../components/participants-requirements';
import { Cron } from '@nestjs/schedule';
import { BenchmarkStatus } from '@gscwd-api/utils';

@Injectable()
export class BenchmarkService extends CrudHelper<Benchmark> {
  constructor(
    private readonly crudService: CrudService<Benchmark>,
    private readonly benchmarkParticipantsService: BenchmarkParticipantsService,
    private readonly benchmarkParticipantRequirementsService: BenchmarkParticipantRequirementsService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
  }

  /* find benchmark by id */
  async findBenchmarkById(id: string) {
    try {
      /* find benchmark */
      const benchmark = await this.crudService.findOneBy({
        findBy: {
          id: id,
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      /* find benchmark participants */
      const participants = await this.benchmarkParticipantsService.findAllParticipantsByBenchmarkId(id);

      /* custom return */
      return {
        ...benchmark,
        participants: participants,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* insert benchmark */
  async createBenchmark(data: CreateBenchmarkDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { participants, ...rest } = data;

        /* insert benchmark */
        const benchmark = await this.crudService.transact<Benchmark>(entityManager).create({
          dto: {
            ...rest,
          },
          onError: (error) => {
            throw error;
          },
        });

        /* insert participants and requirements */
        const employees = await Promise.all(
          participants.map(async (items) => {
            /* insert participants */
            const participants = await this.benchmarkParticipantsService.createParticipants(
              {
                benchmark: benchmark.id,
                employeeId: items.employeeId,
              },
              entityManager
            );

            return participants;
          })
        );

        /* custom return */
        return {
          ...benchmark,
          participants: employees,
        };
      });
    } catch (error) {
      Logger.error(error);
      /* custom error */
      if (error.code === '23505' || error.status === 409) {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
      }
    }
  }

  /* edit benchmark */
  async updateBenchmark(id: string, data: UpdateBenchmarkDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        /* deconstruct data */
        const { participants, ...rest } = data;

        /* check if benchmark id is existing */
        await this.crudService.transact<Benchmark>(entityManager).findOneBy({
          findBy: {
            id: id,
          },
          onError: () => {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          },
        });

        /* remove all participants by benchmark id */
        const deleteParticipants = await this.benchmarkParticipantsService.deleteParticipants(id, entityManager);

        /* validate deleted value */
        if (deleteParticipants.affected > 0) {
          /* insert new participants */
          await Promise.all(
            participants.map(async (items) => {
              /* insert participants */
              return await this.benchmarkParticipantsService.createParticipants(
                {
                  benchmark: id,
                  employeeId: items.employeeId,
                },
                entityManager
              );
            })
          );

          /* return updated  */
          return await this.crudService.transact<Benchmark>(entityManager).update({
            updateBy: {
              id: id,
            },
            dto: {
              ...rest,
            },
          });
        } else {
          return {
            affected: 0,
          };
        }
      });
    } catch (error) {
      Logger.error(error);
      /* custom error */
      if (error.code === '23505' || error.status === 409) {
        /* Duplicate key violation */
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: { message: 'Duplicate key violation', step: 1 },
          },
          HttpStatus.CONFLICT,
          {
            cause: error,
          }
        );
      } else if (error.code === '23503') {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Foreign key constraint violation', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          }
        );
      } else if (error.status === 404) {
        /* Foreign key constraint violation */
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: { message: 'Not found', step: 1 },
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          }
        );
      } else {
        /* Handle other errors as needed */
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: { message: 'Bad request', step: 1 },
          },
          HttpStatus.BAD_REQUEST,
          { cause: error }
        );
      }
    }
  }

  /* find all participants by benchmark id */
  async findAllParticipantRequirementsByBenchmarkId(benchmarkId: string) {
    try {
      await this.crudService.findOneBy({
        findBy: {
          id: benchmarkId,
        },
        onError: () => {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        },
      });

      const participants = await this.benchmarkParticipantsService.findAllParticipantsByBenchmarkId(benchmarkId);

      return await Promise.all(
        participants.map(async (items) => {
          const requirements = await this.benchmarkParticipantRequirementsService.findParticipantRequirementsByParticipantsId(
            items.benchmarkParticipants
          );

          return {
            benchmarkParticipants: items.benchmarkParticipants,
            employeeId: items.employeeId,
            name: items.name,
            learnersJournal: requirements,
          };
        })
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* update all requirements by participant id */
  async updateAllParticipantRequirementsByBenchmarkId(benchmarkId: string, data: BenchmarkParticipantRequirementsDto) {
    try {
      return await this.dataSource.transaction(async (entityManager) => {
        const { participants } = data;
        /* check if benchmark id is existing */
        await this.crudService.transact<Benchmark>(entityManager).findOneBy({
          findBy: {
            id: benchmarkId,
          },
          onError: () => {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          },
        });

        /* update all participants requirements */
        const affected = await Promise.all(
          participants.map(async (items) => {
            return await this.benchmarkParticipantRequirementsService.updateParticipantRequirementsByParticipantId(items, entityManager);
          })
        );

        const totalCount = affected.reduce((total, count) => total + count.affected, 0);
        return {
          affected: totalCount,
        };
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  /* scheduler update other training status  */
  @Cron('* 59 23 * * *')
  async updateBenchmarkStatus() {
    try {
      const currentDate = new Date();

      Logger.log('------ Update benchmark status to done -----------');

      return await this.crudService.update({
        updateBy: {
          dateTo: currentDate,
        },
        dto: {
          status: BenchmarkStatus.DONE,
        },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
