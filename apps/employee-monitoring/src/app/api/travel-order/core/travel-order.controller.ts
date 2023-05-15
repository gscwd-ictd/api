import { TravelOrderDto, UpdateTravelOrderDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TravelOrderService } from './travel-order.service';

@Controller({ version: '1', path: 'travel-order' })
export class TravelOrderController {
  constructor(private readonly travelOrderService: TravelOrderService) {}

  @Post()
  async createTravelOrder(@Body() travelOrderDto: TravelOrderDto) {
    return await this.travelOrderService.createTravelOrderTransaction(travelOrderDto);
  }

  @Get()
  async getAllTravelOrders() {
    return await this.travelOrderService.getAllTravelOrders();
  }

  @Put()
  async updateTravelOrder(@Body() updateTravelOrderDto: UpdateTravelOrderDto) {
    return await this.travelOrderService.updateTravelOrder(updateTravelOrderDto);
  }

  @Delete(':travel_order_id')
  async deleteTravelOrder(@Param('travel_order_id') travelOrderId: string) {
    return await this.travelOrderService.deleteTravelOrder(travelOrderId);
  }
}
