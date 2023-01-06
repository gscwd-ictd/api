import { Module } from '@nestjs/common';
import { UnitTypeService } from './unit-type.service';
import { UnitTypeController } from './unit-type.controller';
import { CrudModule } from '@gscwd-api/crud';
import { UnitType } from '../data/unit-type.entity';

@Module({
  imports: [CrudModule.register(UnitType)],
  providers: [UnitTypeService],
  controllers: [UnitTypeController],
})
export class UnitTypeModule {}
