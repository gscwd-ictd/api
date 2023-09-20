import { CrudModule } from '@gscwd-api/crud';
import { LspAffiliation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspAffiliationsService } from './lsp-affiliations.service';
import { LspAffiliationsController } from './lsp-affiliations.controller';

@Module({
  imports: [CrudModule.register(LspAffiliation)],
  controllers: [LspAffiliationsController],
  providers: [LspAffiliationsService],
  exports: [LspAffiliationsService],
})
export class LspAffiliationsModule {}
