import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemSpecification } from '../data/specification.entity';

@Injectable()
export class SpecificationService extends CrudHelper<ItemSpecification> {
  constructor(private readonly crudService: CrudService<ItemSpecification>) {
    super(crudService);
  }

  async findSpecificationWithRelationsById(id: string) {
    return await this.crudService.findOne(
      {
        where: { id },
        relations: { category: { unit: true, classification: { characteristic: true } } },
        select: {
          category: {
            name: true,
            code: true,
            unit: { symbol: true, name: true },
            classification: { name: true, code: true, characteristic: { name: true, code: true } },
          },
        },
      },
      () => new NotFoundException()
    );
  }

  async findSpecificationByCode(code: string) {
    return await this.crudService.findOne(
      {
        where: { code },
        relations: { category: { unit: true, classification: { characteristic: true } } },
        select: {
          category: {
            name: true,
            code: true,
            unit: { symbol: true, name: true },
            classification: { name: true, code: true, characteristic: { name: true, code: true } },
          },
        },
      },
      () => new NotFoundException()
    );
  }

  async findAllSpecifications(name: string) {
    return await this.crudService.findAll({
      where: { category: { name } },
      relations: { category: true },
      select: { category: { name: true, code: true } },
    });
  }
}
