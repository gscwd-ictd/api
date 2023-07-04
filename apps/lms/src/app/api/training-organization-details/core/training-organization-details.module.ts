import { CrudModule } from '@gscwd-api/crud';
import { TrainingOrganizationDetails } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingOrganizationDetailsService } from './training-organization-details.service';
import { TrainingOrganizationDetailsController } from './training-organization-details.controller';

@Module({
  imports: [CrudModule.register(TrainingOrganizationDetails)],
  controllers: [TrainingOrganizationDetailsController],
  providers: [TrainingOrganizationDetailsService],
  exports: [TrainingOrganizationDetailsService],
})
export class TrainingOrganizationDetailsModule {}
