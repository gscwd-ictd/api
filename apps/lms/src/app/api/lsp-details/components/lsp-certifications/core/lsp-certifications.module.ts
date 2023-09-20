import { CrudModule } from '@gscwd-api/crud';
import { LspCertification } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCertificationsService } from './lsp-certifications.service';
import { LspCertificationsController } from './lsp-certifications.controller';

@Module({
  imports: [CrudModule.register(LspCertification)],
  controllers: [LspCertificationsController],
  providers: [LspCertificationsService],
  exports: [LspCertificationsService],
})
export class LspCertificationsModule {}
