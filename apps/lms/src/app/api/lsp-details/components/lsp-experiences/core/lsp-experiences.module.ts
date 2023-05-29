import { CrudModule } from '@gscwd-api/crud';
import { LspExperience } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspExperiencesController } from './lsp-experiences.controller';
import { LspExperiencesService } from './lsp-experiences.service';

@Module({
  imports: [CrudModule.register(LspExperience)],
  controllers: [LspExperiencesController],
  providers: [LspExperiencesService],
  exports: [LspExperiencesService],
})
export class LspExperiencesModule {}
