import { RawCostEstimate } from '@gscwd-api/utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCostEstimateDto } from '../data/cost-estimates.dto';

@Injectable()
export class CostEstimateService {
  constructor(private readonly datasource: DataSource) {}

  async createCostEstimate(costEstimateDto: CreateCostEstimateDto): Promise<RawCostEstimate> {
    const {
      budgetDetails: { budgetType, generalLedgerAccount },
    } = costEstimateDto;

    try {
      const result = await this.datasource.query('SELECT * FROM create_budget($1, $2)', [budgetType, generalLedgerAccount]);
      return result[0];
    } catch (error) {
      throw new BadRequestException(error, { cause: new Error() });
    }
  }
}
