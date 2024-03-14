import { CrudModule } from '@gscwd-api/crud';
import { LspCertification } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspCertificationsService } from './lsp-certifications.service';

@Module({
  imports: [CrudModule.register(LspCertification)],
  controllers: [],
  providers: [LspCertificationsService],
  exports: [LspCertificationsService],
})
export class LspCertificationsModule {}
