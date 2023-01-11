import { Module } from '@nestjs/common';
import { ValueAddedTaxService } from './value-added-tax.service';
import { ValueAddedTaxController } from './value-added-tax.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ValueAddedTax } from '../data/value-added-tax.entity';

@Module({
  imports: [CrudModule.register(ValueAddedTax)],
  controllers: [ValueAddedTaxController],
  providers: [ValueAddedTaxService],
  exports: [ValueAddedTaxService],
})
export class ValueAddedTaxModule {}
