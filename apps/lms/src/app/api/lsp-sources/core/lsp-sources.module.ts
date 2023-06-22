import { CrudModule } from '@gscwd-api/crud';
import { LspSource } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspSourcesService } from './lsp-sources.service';
import { LspSourcesController } from './lsp-sources.controller';

@Module({
  imports: [CrudModule.register(LspSource)],
  controllers: [LspSourcesController],
  providers: [LspSourcesService],
  exports: [LspSourcesService],
})
export class LspSourcesModule {}
