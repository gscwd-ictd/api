import { Module } from '@nestjs/common';
import { WorkSuspensionService } from './work-suspension.service';
import { WorkSuspensionController } from './work-suspension.controller';
import { CrudModule } from '@gscwd-api/crud';
import { WorkSuspension } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(WorkSuspension)],
  providers: [WorkSuspensionService],
  controllers: [WorkSuspensionController],
  exports: [WorkSuspensionService],
})
export class WorkSuspensionModule {}
