import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BenchmarkParticipants, CreateBenchmarkParticipantsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';

@Injectable()
export class BenchmarkParticipantsService extends CrudHelper<BenchmarkParticipants> {
  constructor(private readonly crudService: CrudService<BenchmarkParticipants>) {
    super(crudService);
  }

  /*  insert benchmark participants */
  async createParticipants(data: CreateBenchmarkParticipantsDto, entityManager: EntityManager) {
    try {
      /* deconstruct data */
      const { benchmark, employeeId } = data;

      /* insert participants */
      const employee = await this.crudService.transact<BenchmarkParticipants>(entityManager).create({
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

      /* custom return */
      return { id: employee.id, employeeId: employee.employeeId };
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
