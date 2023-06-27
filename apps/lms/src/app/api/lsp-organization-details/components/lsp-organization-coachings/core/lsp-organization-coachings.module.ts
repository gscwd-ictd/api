import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationCoaching } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationCoachingsService } from './lsp-organization-coachings.service';

@Module({
  imports: [CrudModule.register(LspOrganizationCoaching)],
  controllers: [],
  providers: [LspOrganizationCoachingsService],
  exports: [LspOrganizationCoachingsService],
})
export class LspOrganizationCoachingsModule {}
