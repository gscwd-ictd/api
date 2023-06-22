import { CrudModule } from '@gscwd-api/crud';
import { LspIndividualCertification } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspIndividualCertificationsController } from './lsp-individual-certifications.controller';
import { LspIndividualCertificationsService } from './lsp-individual-certifications.service';

@Module({
  imports: [CrudModule.register(LspIndividualCertification)],
  controllers: [LspIndividualCertificationsController],
  providers: [LspIndividualCertificationsService],
  exports: [LspIndividualCertificationsService],
})
export class LspIndividualCertificationsModule {}
