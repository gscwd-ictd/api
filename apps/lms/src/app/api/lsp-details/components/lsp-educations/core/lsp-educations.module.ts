import { CrudModule } from '@gscwd-api/crud';
import { LspEducation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspEducationsController } from './lsp-educations.controller';
import { LspEducationsService } from './lsp-educations.service';

@Module({
  imports: [CrudModule.register(LspEducation)],
  controllers: [LspEducationsController],
  providers: [LspEducationsService],
  exports: [LspEducationsService],
})
export class LspEducationsModule {}
