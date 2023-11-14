import { TravelOrder, TravelOrderDto, UpdateTravelOrderDto } from '@gscwd-api/models';
import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserLogsInterceptor } from '../../user-logs/misc/interceptors/user-logs.interceptor';
import { TravelOrderService } from './travel-order.service';

//@UseInterceptors(UserLogsInterceptor<TravelOrder>)
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
