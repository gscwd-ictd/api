import { CrudModule } from '@gscwd-api/crud';
import { TrainingNominee } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingNomineesService } from './training-nominees.service';
import { TrainingNomineesController } from './training-nominees.controller';

@Module({
  imports: [CrudModule.register(TrainingNominee)],
  controllers: [TrainingNomineesController],
  providers: [TrainingNomineesService],
  exports: [TrainingNomineesService],
})
export class TrainingNomineesModule {}
