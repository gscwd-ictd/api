import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemSpecification } from '../data/specification.entity';

@Injectable()
export class SpecificationService extends CrudHelper<ItemSpecification> {
  constructor(private readonly crudService: CrudService<ItemSpecification>) {
    super(crudService);
  }

  async findSpecificationWithRelations(id: string) {
    return await this.crudService.findOne(
      {
        where: { id },
        relations: { category: { unit: true, classification: { characteristic: true } } },
        select: {
          category: {
            name: true,
            code: true,
            unit: { code: true, name: true },
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
