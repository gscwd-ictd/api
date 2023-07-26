import { CrudModule } from '@gscwd-api/crud';
import { TrainingDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingDetailsService } from './training-details.service';
import { TrainingDetailsController } from './training-details.controller';
import { TrainingDistributionsModule } from '../components/training-distributions';
import { TrainingNomineesModule } from '../components/training-nominees';
import { TrainingTagsModule } from '../components/training-tags';
import { TrainingLspIndividualModule } from '../components/training-lsp-individual';
import { TrainingLspOrganizationModule } from '../components/training-lsp-organization/core/training-lsp-organization.module';
import { LspIndividualDetailsModule } from '../../lsp-individual-details';
import { LspOrganizationDetailsModule } from '../../lsp-organization-details';

@Module({
  imports: [
    CrudModule.register(TrainingDetails),
    TrainingLspIndividualModule,
    TrainingLspOrganizationModule,
    TrainingDistributionsModule,
    TrainingNomineesModule,
    TrainingTagsModule,
    LspIndividualDetailsModule,
    LspOrganizationDetailsModule,
  ],
  controllers: [TrainingDetailsController],
  providers: [TrainingDetailsService],
  exports: [TrainingDetailsService],
})
export class TrainingDetailsModule {}
