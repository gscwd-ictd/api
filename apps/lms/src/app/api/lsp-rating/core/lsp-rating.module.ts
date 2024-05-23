import { CrudModule } from '@gscwd-api/crud';
import { LspRating } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { LspRatingController } from './lsp-rating.controller';
import { LspRatingService } from './lsp-rating.service';
import { TrainingTagsModule } from '../../training/components/tags';
import { LspDetailsModule } from '../../lsp-details';

@Module({
  imports: [CrudModule.register(LspRating), TrainingTagsModule, LspDetailsModule],
  controllers: [LspRatingController],
  providers: [LspRatingService],
  exports: [LspRatingService],
})
export class LspRatingModule {}
