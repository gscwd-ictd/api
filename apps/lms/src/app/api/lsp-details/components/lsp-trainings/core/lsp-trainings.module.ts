import { CrudModule } from '@gscwd-api/crud';
import { LspTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspTrainingsService } from './lsp-trainings.service';
import { LspTrainingsController } from './lsp-trainings.controller';

@Module({
  imports: [CrudModule.register(LspTraining)],
  controllers: [LspTrainingsController],
  providers: [LspTrainingsService],
  exports: [LspTrainingsService],
})
export class LspTrainingsModule {}
