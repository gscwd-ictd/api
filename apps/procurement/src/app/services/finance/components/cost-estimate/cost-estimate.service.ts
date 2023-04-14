import { CostEstimatePatterns, MicroserviceClient } from '@gscwd-api/microservices';
import { ProjectDetailsSummary } from '@gscwd-api/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class CostEstimateService {
  constructor(private readonly client: MicroserviceClient) {}

  async getAllProjects({ page, limit }: IPaginationOptions) {
    return (await this.client.call({
      action: 'send',
      pattern: CostEstimatePatterns.FIND_ALL,
      payload: { page, limit },
    })) as Pagination<ProjectDetailsSummary>;
  }

  async getProjectDetailsById(id: string) {
    return await this.client.call({
      action: 'send',
      pattern: CostEstimatePatterns.FIND_BY_ID,
      payload: { id },
      onError: (error) => new NotFoundException(error),
    });
  }
}
