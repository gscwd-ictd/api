import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { MicroserviceClient } from '@gscwd-api/microservices';
import { TravelOrder, TravelOrderDto, UpdateTravelOrderDto } from '@gscwd-api/models';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TravelOrderItineraryService } from '../components/travel-order-itinerary/core/travel-order-itinerary.service';
import dayjs = require('dayjs');

@Injectable()
export class TravelOrderService extends CrudHelper<TravelOrder> {
  constructor(
    private readonly crudService: CrudService<TravelOrder>,
    private dataSource: DataSource,
    private readonly travelOrderItineraryService: TravelOrderItineraryService,
    private readonly client: MicroserviceClient
  ) {
    super(crudService);
  }

  async createTravelOrderTransaction(travelOrderDto: TravelOrderDto) {
    const createdTravelOrder = await this.dataSource.transaction(async (entityManager) => {
      const { itinerary, employeeId, ...travelOrder } = travelOrderDto;
      const { ...restOfTravelOrder } = travelOrder;

      const newTravelOrder = await this.crudService.transact<TravelOrder>(entityManager).create({
        dto: { employeeId, ...restOfTravelOrder },
        onError: ({ error }) => {
          return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
        },
      });
      const newTravelOrderItinerary = await Promise.all(
        itinerary.map(async (travelOrderItineraryItem) => {
          return await this.travelOrderItineraryService.addTravelOrderItineraryTransaction(
            { travelOrderId: newTravelOrder, ...travelOrderItineraryItem },
            entityManager
          );
        })
      );
      return {
        travelOrder: newTravelOrder,
        itinerary: newTravelOrderItinerary,
      };
    });
    return createdTravelOrder;
  }

  async getTravelOrdersByYearMonth(yearMonth: string) {
    const dateFrom = dayjs(yearMonth + '-01').format('YYYY-MM-DD');
    const dateTo = dayjs(yearMonth + '-' + dayjs(dateFrom).daysInMonth()).format('YYYY-MM-DD');
    console.log(dateFrom, ' ', dateTo);
    const travelOrders = (await this.rawQuery<string, TravelOrder[]>(
      `
      SELECT 
          travel_order_id id, 
          employee_id_fk employeeId, 
          purpose_of_travel purposeOfTravel, 
          travel_order_no travelOrderNo,
          DATE_FORMAT(date_requested,'%Y-%m-%d') dateRequested,
          DATE_FORMAT(get_travel_order_date_range(travel_order_id,'from'),'%Y-%m-%d') dateFrom,
          DATE_FORMAT(get_travel_order_date_range(travel_order_id,'to'),'%Y-%m-%d') dateTo
      FROM travel_order 
      WHERE DATE_FORMAT(get_travel_order_date_range(travel_order_id,'from'),'%Y-%m-%d') BETWEEN DATE_SUB(?,INTERVAL 1 DAY) 
      AND DATE_ADD(?,INTERVAL 1 DAY);
      `,
      [dateFrom, dateTo]
    )) as TravelOrder[];

    const allTravelOrders = await Promise.all(
      travelOrders.map(async (travelOrder) => {
        const { employeeId, ...restOfTravelOrder } = travelOrder;

        const employeeName = (await this.client.call<string, string, { fullName: string }>({
          action: 'send',
          payload: employeeId,
          pattern: 'get_employee_name',
          onError: (error) => new NotFoundException(error),
        })) as { fullName: string };

        const itinerary = await this.travelOrderItineraryService.crud().findAll({
          find: {
            select: { id: true, scheduleDate: true, schedulePlace: true },
            where: { travelOrderId: { id: travelOrder.id } },
          },
        });
        return { ...restOfTravelOrder, employee: { employeeId, fullName: employeeName.fullName }, itinerary };
      })
    );
    return allTravelOrders;
  }

  async getAllTravelOrders() {
    const travelOrders = await this.rawQuery<string, TravelOrder[]>(`
    SELECT 
        travel_order_id id, 
        employee_id_fk employeeId, 
        purpose_of_travel purposeOfTravel, 
        travel_order_no travelOrderNo,
        DATE_FORMAT(date_requested,'%Y-%m-%d') dateRequested,
        DATE_FORMAT(get_travel_order_date_range(travel_order_id,'from'),'%Y-%m-%d') dateFrom,
        DATE_FORMAT(get_travel_order_date_range(travel_order_id,'to'),'%Y-%m-%d') dateTo
    FROM travel_order 
    WHERE (YEAR(get_travel_order_date_range(travel_order_id,'from')) = YEAR(NOW()) OR YEAR(get_travel_order_date_range(travel_order_id,'from'))=(YEAR(NOW())-1))`);

    const allTravelOrders = await Promise.all(
      travelOrders.map(async (travelOrder) => {
        const { employeeId, ...restOfTravelOrder } = travelOrder;

        const employeeName = (await this.client.call<string, string, { fullName: string }>({
          action: 'send',
          payload: employeeId,
          pattern: 'get_employee_name',
          onError: (error) => new NotFoundException(error),
        })) as { fullName: string };

        const itinerary = await this.travelOrderItineraryService.crud().findAll({
          find: {
            select: { id: true, scheduleDate: true, schedulePlace: true },
            where: { travelOrderId: { id: travelOrder.id } },
          },
        });
        return { ...restOfTravelOrder, employee: { employeeId, fullName: employeeName.fullName }, itinerary };
      })
    );
    return allTravelOrders;
  }

  async updateTravelOrder(updateTravelOrder: UpdateTravelOrderDto) {
    const { id, employeeId, purposeOfTravel, travelOrderNo, itinerary, isPtrRequired, dateRequested } = updateTravelOrder;

    const updateTravelOrderResult = await this.dataSource.transaction(async (entityManager) => {
      const updateResult = await this.crudService.transact(entityManager).update({
        dto: { employeeId, purposeOfTravel, travelOrderNo },
        updateBy: { id },
        onError: ({ error }) => {
          return new HttpException(error, HttpStatus.BAD_REQUEST, { cause: error as Error });
        },
      });
      const deletedResult = await this.travelOrderItineraryService.deleteAllTravelOrderItineraryByTravelOrderIdTransaction(id, entityManager);
      const updatedItinerary = await Promise.all(
        itinerary.map(async (itineraryItem) => {
          const { scheduleDate, schedulePlace } = itineraryItem;
          const newItinerary = await this.travelOrderItineraryService.addTravelOrderItineraryTransaction(
            {
              travelOrderId: {
                createdAt: null,
                deletedAt: null,
                updatedAt: null,
                employeeId,
                id,
                purposeOfTravel,
                travelOrderNo,
                isPtrRequired,
                dateRequested,
              },
              scheduleDate,
              schedulePlace,
            },
            entityManager
          );
          return newItinerary;
        })
      );
    });
    return updateTravelOrder;
  }

  async getTravelOrderById(travelOrderId: string) {
    const travelOrder = await this.crudService.findOne({ find: { where: { id: travelOrderId } } });
    const itinerary = await this.travelOrderItineraryService.crud().findAll({ find: { where: { travelOrderId: { id: travelOrder.id } } } });
    return { ...travelOrder, itinerary };
  }

  async deleteTravelOrder(travelOrderId: string) {
    const travelOrder = await this.getTravelOrderById(travelOrderId);
    const deleteResult = await this.dataSource.transaction(async (entityManager) => {
      const deleteItineraryResult = await this.travelOrderItineraryService.deleteAllTravelOrderItineraryByTravelOrderIdTransaction(
        travelOrderId,
        entityManager
      );
      const deleteTravelOrder = await this.crudService
        .transact<TravelOrder>(entityManager)
        .delete({ softDelete: false, deleteBy: { id: travelOrderId } });
      if (deleteItineraryResult.affected > 0 && deleteTravelOrder.affected > 0) return true;
    });

    if (deleteResult) return travelOrder;
  }
}
