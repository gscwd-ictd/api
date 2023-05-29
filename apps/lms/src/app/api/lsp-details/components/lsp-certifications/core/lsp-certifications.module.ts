import { CrudModule } from '@gscwd-api/crud';
import { LspCertification } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCertificationsController } from './lsp-certifications.controller';
import { LspCertificationsService } from './lsp-certifications.service';

@Module({
  imports: [CrudModule.register(LspCertification)],
  controllers: [LspCertificationsController],
  providers: [LspCertificationsService],
  exports: [LspCertificationsService],
})
export class LspCertificationsModule {}
