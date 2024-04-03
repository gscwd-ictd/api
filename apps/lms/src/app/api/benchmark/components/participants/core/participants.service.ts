import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BenchmarkParticipants, CreateBenchmarkParticipantsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

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
      return { employeeId: employee.employeeId };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
