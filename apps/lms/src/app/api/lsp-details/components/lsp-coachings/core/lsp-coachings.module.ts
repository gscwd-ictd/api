import { CrudModule } from '@gscwd-api/crud';
import { LspCoaching } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCoachingsService } from './lsp-coachings.service';
import { LspCoachingsController } from './lsp-coachings.controller';

@Module({
  imports: [CrudModule.register(LspCoaching)],
  controllers: [LspCoachingsController],
  providers: [LspCoachingsService],
  exports: [LspCoachingsService],
})
export class LspCoachingsModule {}
