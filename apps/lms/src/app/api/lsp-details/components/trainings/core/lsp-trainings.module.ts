import { CrudModule } from '@gscwd-api/crud';
import { LspTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspTrainingsService } from './lsp-trainings.service';

@Module({
  imports: [CrudModule.register(LspTraining)],
  controllers: [],
  providers: [LspTrainingsService],
  exports: [LspTrainingsService],
})
export class LspTrainingsModule {}
