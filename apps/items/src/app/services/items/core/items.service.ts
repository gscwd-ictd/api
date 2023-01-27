import { ItemsView } from '@gscwd-api/app-entities';
import { CrudService, throwRpc } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsService {
  constructor(private readonly crudService: CrudService<ItemsView>) {}

  async findAll(page: number, limit: number) {
    return await this.crudService.findAll({
      pagination: { page, limit },
      find: {
        select: {
          details_id: true,
          characteristic_code: true,
          classification_code: true,
          classification_name: true,
          category_code: true,
          category_name: true,
          specification_code: true,
          specification_name: true,
          description: true,
        },
      },
      onError: (error) => throwRpc(error),
    });
  }

  async findOneBy(id: string) {
    return await this.crudService.findOneBy({
      findBy: { details_id: id },
      onError: (error) => throwRpc(error),
    });
  }
}
