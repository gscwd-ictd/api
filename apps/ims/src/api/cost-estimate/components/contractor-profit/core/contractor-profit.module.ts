import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { ContractorProfit } from '../data/contractor-profit.entity';
import { ContractorProfitController } from './contractor-profit.controller';
import { ContractorProfitService } from './contractor-profit.service';

@Module({
  imports: [CrudModule.register(ContractorProfit)],
  controllers: [ContractorProfitController],
  providers: [ContractorProfitService],
  exports: [ContractorProfitService],
})
export class ContractorProfitModule {}
