import { CrudModule } from '@gscwd-api/crud';
import { LspOrganizationTraining } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspOrganizationTrainingsService } from './lsp-organization-trainings.service';
import { LspOrganizationTrainingsController } from './lsp-organization-trainings.controller';

@Module({
  imports: [CrudModule.register(LspOrganizationTraining)],
  controllers: [LspOrganizationTrainingsController],
  providers: [LspOrganizationTrainingsService],
  exports: [LspOrganizationTrainingsService],
})
export class LspOrganizationTrainingsModule {}
