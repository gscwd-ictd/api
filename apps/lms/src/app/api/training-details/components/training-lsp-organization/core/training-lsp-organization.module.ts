import { CrudModule } from '@gscwd-api/crud';
import { TrainingLspOrganization } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingLspOrganizationService } from './training-lsp-organization.service';
import { TrainingLspOrganizationController } from './training-lsp-organization.controller';

@Module({
  imports: [CrudModule.register(TrainingLspOrganization)],
  controllers: [TrainingLspOrganizationController],
  providers: [TrainingLspOrganizationService],
  exports: [TrainingLspOrganizationService],
})
export class TrainingLspOrganizationModule {}
