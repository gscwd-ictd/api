import { Injectable } from '@nestjs/common';
import { CategoryService } from '../components/category';
import { ClassificationService } from '../components/classification';
import { SpecificationService } from '../components/specification';

@Injectable()
export class ItemService {
  constructor(
    // inject classificaion service
    private readonly classificationService: ClassificationService,

    // inject category service
    private readonly categoryService: CategoryService,

    // inject specification service
    private readonly specificationService: SpecificationService
  ) {}

  async findAllClassificationByCode(code: string) {
    return code;
  }
}
