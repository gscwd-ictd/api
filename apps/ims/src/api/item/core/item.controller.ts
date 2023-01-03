import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryService } from '../components/category';
import { CharacteristicService } from '../components/characteristic';
import { ClassificationService } from '../components/classification';
import { SpecificationService } from '../components/specification';

@Controller('info/items')
export class ItemController {
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

  @Get('classification')
  async findAllClassificationsByCharacteristic(@Query('characteristic') characteristicName: string) {
    return await this.classificationService.findAllClassification(characteristicName);
  }

  @Get('classification/:id')
  async findClassificationByCharacteristic(@Param('id') classificationId: string) {
    return await this.classificationService.findClassification(classificationId);
  }

  @Get('categories')
  async findAllCategoriesByClassification(@Query('classification') classificationName?: string, @Query('unit') unitName?: string) {
    // check if classification is specified as query
    if (classificationName) return await this.categoryService.findAllCategoriesByClassification(classificationName);

    // check if unit is specified as query
    if (unitName) return await this.categoryService.findAllCategoriesByMeasurementUnit(unitName);

    // throw exception if there is not query at all
    throw new BadRequestException();
  }

  @Get('categories/:id')
  async findCategoryByClassification(@Param('id') categoryId: string) {
    return await this.categoryService.findCategory(categoryId);
  }

  @Get('specifications')
  async findAllSpecificationsByCategory(@Query('category') categoryName: string) {
    return await this.specificationService.findAllSpecifications(categoryName);
  }

  @Get('specifications/:id')
  async findSpecificationByCategory(@Param('id') specificationId: string) {
    return await this.specificationService.findSpecification(specificationId);
  }
}
