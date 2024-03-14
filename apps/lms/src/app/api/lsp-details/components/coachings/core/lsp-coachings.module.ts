import { CrudModule } from '@gscwd-api/crud';
import { LspCoaching } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCoachingsService } from './lsp-coachings.service';

@Module({
  imports: [CrudModule.register(LspCoaching)],
  controllers: [],
  providers: [LspCoachingsService],
  exports: [LspCoachingsService],
})
export class LspCoachingsModule {}
