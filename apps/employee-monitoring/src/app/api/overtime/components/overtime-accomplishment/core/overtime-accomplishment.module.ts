import { Module } from '@nestjs/common';
import { OvertimeAccomplishmentService } from './overtime-accomplishment.service';
import { OvertimeAccomplishmentController } from './overtime-accomplishment.controller';
import { CrudModule } from '@gscwd-api/crud';
import { OvertimeAccomplishment } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(OvertimeAccomplishment)],
  providers: [OvertimeAccomplishmentService],
  controllers: [OvertimeAccomplishmentController],
  exports: [OvertimeAccomplishmentService],
})
export class OvertimeAccomplishmentModule {}
