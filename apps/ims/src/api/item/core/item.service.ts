import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../components/category';
import { CharacteristicService } from '../components/characteristic';
import { ClassificationService } from '../components/classification';
import { SpecificationService } from '../components/specification';

@Injectable()
export class ItemService {
  constructor(
    private readonly characteristicService: CharacteristicService,

    // inject classificaion service
    private readonly classificationService: ClassificationService,

    // inject category service
    private readonly categoryService: CategoryService,

    // inject specification service
    private readonly specificationService: SpecificationService
  ) {}

  async findCharacteristicByCode(code: string) {
    if (code === undefined) throw new NotFoundException();

    return await this.characteristicService.findOneBy({ code }, () => new NotFoundException());
  }

  async findClassificationByCode(code: string) {
    if (code === undefined) throw new NotFoundException();

    return await this.classificationService.findOne(
      {
        where: { code },
        relations: { characteristic: true },
        select: { characteristic: { name: true, code: true, description: true } },
      },
      () => new NotFoundException()
    );
  }

  async findCategoryByCode(code: string) {
    if (code === undefined) throw new NotFoundException();

    return await this.categoryService.findOne(
      {
        where: { code },
        relations: { classification: { characteristic: true } },
        select: { classification: { name: true, code: true, description: true, characteristic: { name: true, code: true, description: true } } },
      },
      () => new NotFoundException()
    );
  }

  async findSpecificationByCode(code: string) {
    if (code === undefined) throw new NotFoundException();

    return await this.specificationService.findOne(
      {
        where: { code },
        relations: { category: { classification: { characteristic: true } } },
        select: {
          category: {
            name: true,
            code: true,
            description: true,
            classification: { name: true, code: true, characteristic: { name: true, code: true, description: true } },
          },
        },
      },
      () => new NotFoundException()
    );
  }
}
