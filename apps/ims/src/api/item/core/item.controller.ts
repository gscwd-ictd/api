import { GeneratorService } from '@gscwd-api/generator';
import { Controller, Get } from '@nestjs/common';

@Controller('testing')
export class ItemController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get()
  testing() {
    return this.generatorService.generate();
  }
}
