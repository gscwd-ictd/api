import { Module } from '@nestjs/common';
import { TrainingDetailsModule } from '../../training';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [TrainingDetailsModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
