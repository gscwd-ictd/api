import { Module } from '@nestjs/common';
import { CharacteristicService } from './characteristic.service';
import { CharacteristicController } from './characteristic.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemCharacteristic } from '../data/characteristic.entity';

@Module({
  imports: [CrudModule.register(ItemCharacteristic)],
  providers: [CharacteristicService],
  controllers: [CharacteristicController],
})
export class CharacteristicModule {}
