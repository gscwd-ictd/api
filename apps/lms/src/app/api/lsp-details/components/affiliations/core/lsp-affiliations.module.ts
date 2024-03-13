import { CrudModule } from '@gscwd-api/crud';
import { LspAffiliation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspAffiliationsService } from './lsp-affiliations.service';

@Module({
  imports: [CrudModule.register(LspAffiliation)],
  controllers: [],
  providers: [LspAffiliationsService],
  exports: [LspAffiliationsService],
})
export class LspAffiliationsModule {}
