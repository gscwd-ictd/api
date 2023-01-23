import { Module } from '@nestjs/common';
import { UnitTypesService } from './unit-types.service';
import { UnitTypesController } from './unit-types.controller';
import { CrudModule } from '@gscwd-api/crud';
import { UnitType } from '@gscwd-api/app-entities';

@Module({
  imports: [CrudModule.register(UnitType)],
  providers: [UnitTypesService],
  controllers: [UnitTypesController],
})
export class UnitTypesModule {}
