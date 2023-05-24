import { CrudModule } from '@gscwd-api/crud';
import { LspCoaching } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCoachingsController } from './lsp-coachings.controller';
import { LspCoachingsService } from './lsp-coachings.service';

@Module({
  imports: [CrudModule.register(LspCoaching)],
  controllers: [LspCoachingsController],
  providers: [LspCoachingsService],
  exports: [LspCoachingsService],
})
export class LspCoachingsModule {}
