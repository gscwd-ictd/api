import { ItemClassification } from '@gscwd-api/models';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { ClassificationsController } from './classifications.controller';
import { ClassificationsService } from './classifications.service';

@Module({
  imports: [CrudModule.register(ItemClassification)],
  controllers: [ClassificationsController],
  providers: [ClassificationsService],
  exports: [ClassificationsService],
})
export class ClassificationsModule {}
