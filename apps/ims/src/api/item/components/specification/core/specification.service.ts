import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemSpecification } from '../data/specification.entity';

@Injectable()
export class SpecificationService extends CrudHelper<ItemSpecification> {
  constructor(private readonly crudService: CrudService<ItemSpecification>) {
    super(crudService);
  }

  async findSpecification(id: string) {
    return await this.crudService.findOne(
      { where: { id }, relations: { category: true }, select: { category: { name: true, code: true } } },
      () => new NotFoundException()
    );
  }

  async findAllSpecifications(name: string) {
    if (name === undefined) throw new BadRequestException();

    return await this.crudService.findAll({
      where: { category: { name } },
      relations: { category: true },
      select: { category: { name: true, code: true } },
    });
  }
}
