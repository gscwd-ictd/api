import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ItemClassification } from '../data/classification.entity';

@Injectable()
export class ClassificationService extends CrudHelper<ItemClassification> {
  constructor(private readonly crudService: CrudService<ItemClassification>) {
    super(crudService);
  }

  async findClassification(id: string) {
    return await this.crudService.findOne(
      {
        where: { id },
        relations: { characteristic: true },
        select: { characteristic: { name: true, code: true } },
      },
      () => new NotFoundException()
    );
  }

  async findAllClassification(name: string) {
    if (name === undefined) throw new BadRequestException();

    return await this.crudService.findAll({
      where: { characteristic: { name } },
      relations: { characteristic: true },
      select: { characteristic: { name: true, code: true } },
    });
  }
}
