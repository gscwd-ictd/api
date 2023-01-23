import { PpeClassification } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { PpeClassificationsController } from './classifications.controller';
import { PpeClassificationsService } from './classifications.service';

@Module({
  imports: [CrudModule.register(PpeClassification)],
  controllers: [PpeClassificationsController],
  providers: [PpeClassificationsService],
  exports: [PpeClassificationsService],
})
export class PpeClassificationsModule {}
