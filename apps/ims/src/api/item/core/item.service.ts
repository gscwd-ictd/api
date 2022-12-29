import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from '../components/category';
import { CharacteristicService } from '../components/characteristic';
import { ClassificationService } from '../components/classification';
import { SpecificationService } from '../components/specification';

@Injectable()
export class ItemService {
  constructor(
    // inject characteristic service
    private readonly characteristicService: CharacteristicService,

    // inject classification service
    private readonly classificationService: ClassificationService,

    // inject category service
    private readonly categoryService: CategoryService,

    // inject specification service
    private readonly specificationService: SpecificationService
  ) {}

  async findClassification(id: string) {
    try {
      return await this.classificationService.findOne({
        where: { id },
        relations: { characteristic: true },
        select: { characteristic: { name: true, code: true } },
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findAllClassifications(name: string) {
    if (name === undefined) throw new BadRequestException();

    return await this.classificationService.findAll({
      where: { characteristic: { name } },
      relations: { characteristic: true },
      select: { characteristic: { name: true, code: true } },
    });
  }
}
