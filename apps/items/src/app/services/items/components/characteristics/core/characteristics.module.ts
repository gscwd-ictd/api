import { ItemCharacteristic } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';

@Module({
  imports: [CrudModule.register(ItemCharacteristic)],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService],
})
export class CharacteristicsModule {}
