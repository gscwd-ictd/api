import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BenchmarkParticipantRequirements, CreateBenchmarkParticipantRequirementsDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class BenchmarkParticipantRequirementsService extends CrudHelper<BenchmarkParticipantRequirements> {
  constructor(private readonly crudService: CrudService<BenchmarkParticipantRequirements>) {
    super(crudService);
  }

  /* insert participant requirements */
  async createParticipantRequirementsService(data: CreateBenchmarkParticipantRequirementsDto, entityManager: EntityManager) {
    try {
      return await this.crudService.transact<BenchmarkParticipantRequirements>(entityManager).create({
        dto: {
          benchmarkParticipants: {
            id: data.benchmarkParticipants,
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
