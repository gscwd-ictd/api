import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemCategory } from '../data/category.entity';

@Injectable()
export class CategoryService extends CrudHelper<ItemCategory> {
  constructor(private readonly crudService: CrudService<ItemCategory>) {
    super(crudService);
  }

  async findCategory(id: string) {
    return await this.crudService.findOne(
      {
        where: { id },
        relations: { classification: true, unit: true },
        select: { classification: { name: true, code: true }, unit: { name: true, code: true } },
      },
      () => new NotFoundException()
    );
  }

  async findAllCategoriesByClassification(name: string) {
    return await this.crudService.findAll({
      where: { classification: { name } },
      relations: { classification: true, unit: true },
      select: { classification: { name: true, code: true }, unit: { name: true, code: true } },
    });
  }

  async findAllCategoriesByMeasurementUnit(name: string) {
    return await this.crudService.findAll({
      where: { unit: { name } },
      relations: { unit: true },
      select: { unit: { name: true, code: true, description: true } },
    });
  }
}
