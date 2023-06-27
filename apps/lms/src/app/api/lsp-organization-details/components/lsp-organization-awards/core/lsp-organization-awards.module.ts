import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationAward } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationAwardsService } from './lsp-organization-awards.service';
import { LspOrganizationAwardsController } from './lsp-organization-awards.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationAward)],
  controllers: [LspOrganizationAwardsController],
  providers: [LspOrganizationAwardsService],
  exports: [LspOrganizationAwardsService],
})
export class LspOrganizationAwardsModule {}
