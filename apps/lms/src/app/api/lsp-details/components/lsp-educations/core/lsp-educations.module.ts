import { CrudModule } from '@gscwd-api/crud';
import { LspEducation } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspEducationsService } from './lsp-educations.service';
import { LspEducationsController } from './lsp-educations.controller';

@Module({
  imports: [CrudModule.register(LspEducation)],
  controllers: [LspEducationsController],
  providers: [LspEducationsService],
  exports: [LspEducationsService],
})
export class LspEducationsModule {}
