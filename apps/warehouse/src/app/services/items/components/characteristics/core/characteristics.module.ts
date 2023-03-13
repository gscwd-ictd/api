import { Module } from '@nestjs/common';
import { ItemsMicroserviceClientModule } from '../../../../../../connections';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';

@Module({
  imports: [ItemsMicroserviceClientModule],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService],
})
export class CharacteristicsModule {}
