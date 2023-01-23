import { PpeSpecification } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { GeneratorModule } from '@gscwd-api/generator';
import { Module } from '@nestjs/common';
import { PpeSpecificationsController } from './specifications.controller';
import { PpeSpecificationsService } from './specifications.service';

@Module({
  imports: [
    // crud module
    CrudModule.register(PpeSpecification),

    // generator service
    GeneratorModule.register({ length: 10, lowercase: false }),
  ],
  controllers: [PpeSpecificationsController],
  providers: [PpeSpecificationsService],
  exports: [PpeSpecificationsService],
})
export class PpeSpecificationsModule {}
