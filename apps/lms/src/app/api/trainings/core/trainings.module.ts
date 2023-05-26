import { CrudModule } from '@gscwd-api/crud';
import { Training } from '@gscwd-api/models';
import { Module } from '@nestjs/common';
import { TrainingsService } from './trainings.service';
import { TrainingsController } from './trainings.controller';

@Module({
  imports: [CrudModule.register(Training)],
  controllers: [TrainingsController],
  providers: [TrainingsService],
  exports: [TrainingsService],
})
export class TrainingsModule {}
