import { Module } from '@nestjs/common';
import { DtrCorrectionService } from './dtr-correction.service';
import { DtrCorrectionController } from './dtr-correction.controller';
import { CrudModule } from '@gscwd-api/crud';
import { DtrCorrection } from '@gscwd-api/models';

@Module({
  imports: [CrudModule.register(DtrCorrection)],
  providers: [DtrCorrectionService],
  controllers: [DtrCorrectionController],
  exports: [DtrCorrectionService],
})
export class DtrCorrectionModule {}
