import { ItemPpeDetailsView } from '@gscwd-api/app-entities';
import { CrudModule } from '@gscwd-api/crud';
import { Module } from '@nestjs/common';
import { ItemsPpeController } from './items-ppe.controller';
import { ItemsPpeService } from './items-ppe.service';

@Module({
  imports: [CrudModule.register(ItemPpeDetailsView)],
  controllers: [ItemsPpeController],
  providers: [ItemsPpeService],
})
export class ItemsPpeModule {}
