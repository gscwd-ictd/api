import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemClassification } from '../data/classification.entity';

@Injectable()
export class ClassificationService extends CrudHelper<ItemClassification> {
  constructor(private readonly crudService: CrudService<ItemClassification>) {
    super(crudService);
  }

  async findClassificationWithRelations(id: string) {
    return await this.crudService.findOne(
      {
        where: { id },
        relations: { characteristic: true },
        select: { characteristic: { name: true, code: true } },
      },
      () => new NotFoundException()
    );
  }

  async findAllClassification(code: string) {
    return await this.crudService.findAll({
      where: { characteristic: { code: code.toUpperCase() } },
      relations: { characteristic: true },
      select: { characteristic: { name: true, code: true } },
    });
  }
}
