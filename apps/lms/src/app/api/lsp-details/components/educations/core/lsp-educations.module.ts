import { CrudModule } from '@gscwd-api/crud';
import { LspEducation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspEducationsService } from './lsp-educations.service';

@Module({
  imports: [CrudModule.register(LspEducation)],
  controllers: [],
  providers: [LspEducationsService],
  exports: [LspEducationsService],
})
export class LspEducationsModule {}
