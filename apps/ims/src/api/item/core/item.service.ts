import { Injectable } from '@nestjs/common';
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
}
