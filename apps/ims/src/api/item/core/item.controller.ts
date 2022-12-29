import { Controller, Get, Param, Query } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items/v1')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('classification')
  async findAllClassificationsByCharacteristic(@Query('characteristic') name: string) {
    return await this.itemService.findAllClassifications(name);
  }

  @Get('classification/:id')
  async findClassificationByCharacteristic(@Param('id') classificationId: string) {
    return await this.itemService.findClassification(classificationId);
  }
}
