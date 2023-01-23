import { Module } from '@nestjs/common';
import { UnitOfMeasureModule, UnitTypesModule } from '../components';

@Module({
  imports: [UnitTypesModule, UnitOfMeasureModule],
  controllers: [],
  providers: [],
})
export class UnitModule {}
