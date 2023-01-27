import { Module } from '@nestjs/common';
import { DetailsService } from './details.service';
import { DetailsController } from './details.controller';
import { CrudModule } from '@gscwd-api/crud';
import { ItemDetails } from '@gscwd-api/app-entities';

@Module({
  imports: [CrudModule.register(ItemDetails)],
  providers: [DetailsService],
  controllers: [DetailsController],
})
export class DetailsModule {}
