import { CrudHelper, CrudService } from '@gscwd-api/crud';
import { Injectable } from '@nestjs/common';
import { ItemClassification } from '../data/classification.entity';

@Injectable()
export class ClassificationService extends CrudHelper<ItemClassification> {
  constructor(private readonly crudService: CrudService<ItemClassification>) {
    super(crudService);
  }

  async findAllWithRelations() {
    const repository = this.crudService.getRepository();

    return await repository
      .createQueryBuilder('cl')
      .select('cl.classification_id', 'classificationId')
      .addSelect('cl.name', 'cl_name')
      .addSelect('cl.code', 'cl_code')
      .addSelect('cl.description', 'description')
      .addSelect('cl.created_at', 'createdAt')
      .addSelect('cl.updated_at', 'updatedAt')
      .addSelect('ch.name', 'name')
      .addSelect('ch.code', 'code')
      .innerJoin('item_characteristics', 'ch', 'ch.characteristic_id=cl.characteristic_id_fk')
      .getRawMany();
  }
}
