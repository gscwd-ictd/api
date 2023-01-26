import { PpeDetailsView } from '@gscwd-api/app-entities';
import { CrudService } from '@gscwd-api/crud';
import { MyRpcException } from '@gscwd-api/microservices';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class PpeService {
  constructor(private readonly crudService: CrudService<PpeDetailsView>) {}

  async findAll(page: number, limit: number) {
    return await this.crudService.findAll({
      pagination: { page, limit },
      find: {
        select: {
          specification_id: true,
          characteristic_code: true,
          classification_code: true,
          category_code: true,
          specification_code: true,
          category_name: true,
          details: true,
          description: true,
        },
      },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          details: error,
          message: {
            error: 'Something went wrong.',
            details: error.message,
          },
        }),
    });
  }

  async findOneBy(id: string) {
    return await this.crudService.findOneBy({
      findBy: { specification_id: id },
      onError: (error) =>
        new MyRpcException({
          code: HttpStatus.NOT_FOUND,
          details: error,
          message: {
            error: 'Cannot find ppe item.',
            details: error.message,
          },
        }),
    });
  }
}
