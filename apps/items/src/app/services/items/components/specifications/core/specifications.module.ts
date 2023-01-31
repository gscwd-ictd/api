import { ItemSpecification } from '@gscwd-api/models';
import { CrudModule } from '@gscwd-api/crud';
import { GeneratorModule } from '@gscwd-api/generator';
import { Module } from '@nestjs/common';
import { SpecificationsController } from './specifications.controller';
import { SpecificationsService } from './specifications.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(ItemSpecification),

    // generator module
    GeneratorModule.register({ length: 10, lowercase: false }),
  ],
  controllers: [SpecificationsController],
  providers: [SpecificationsService],
  exports: [SpecificationsService],
})
export class SpecificationsModule {}
