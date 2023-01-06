import { Module } from '@nestjs/common';
import { LaborTypeService } from './labor-type.service';
import { LaborTypeController } from './labor-type.controller';
import { CrudModule } from '@gscwd-api/crud';
import { LaborType } from '../data/labor-type.entity';

@Module({
  imports: [CrudModule.register(LaborType)],
  controllers: [LaborTypeController],
  providers: [LaborTypeService],
  exports: [LaborTypeService],
})
export class LaborTypeModule {}
