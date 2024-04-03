import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Benchmark, CreateBenchmarkDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BenchmarkParticipantsService } from '../components/participants';

@Injectable()
export class BenchmarkService extends CrudHelper<Benchmark> {
  constructor(
    private readonly crudService: CrudService<Benchmark>,
    private readonly benchmarkParticipantsService: BenchmarkParticipantsService,
    private readonly dataSource: DataSource
  ) {
    super(crudService);
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

        /* insert participants */
        const employees = await Promise.all(
          participants.map(async (items) => {
            return await this.benchmarkParticipantsService.createParticipants(
              {
                benchmark: benchmark.id,
                employeeId: items.employeeId,
              },
              entityManager
            );
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
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
