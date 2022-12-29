import { Module } from '@nestjs/common';
import { ClassificationService } from './classification.service';
import { ClassificationController } from './classification.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemClassification } from '../data/classification.entity';

@Module({
  imports: [CrudModule.register(ItemClassification)],
  providers: [ClassificationService],
  controllers: [ClassificationController],
  exports: [ClassificationService],
})
export class ItemClassificationModule {}
